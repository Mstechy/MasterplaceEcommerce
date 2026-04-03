import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePlus, CheckCircle2, Star, Trash2, AlertCircle, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
  isSellerApproved: boolean;
}

interface FormData {
  // Step 1: General Info
  title: string;
  category_id: string;
  brand: string;
  model: string;
  
  // Step 2: Pricing & Inventory
  price: string;
  compare_at_price: string;
  stock_quantity: string;
  sku: string;
  condition: "new" | "refurbished" | "used";
  
  // Step 3: Technical Specs
  description: string;
  warranty_period: string;
  
  // Step 4: SEO & Images
  seo_tags: string;
  images: { file: File; isPrimary: boolean }[];
}

interface Category {
  id: string;
  name: string;
}

interface ImagePreview {
  url: string;
  file: File;
  isPrimary: boolean;
  isUploading: boolean;
}

const validationErrors: Record<string, string> = {};

export default function ProductUploadForm({ userId, onSuccess, onCancel, isSellerApproved }: ProductFormProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    category_id: "",
    brand: "",
    model: "",
    price: "",
    compare_at_price: "",
    stock_quantity: "",
    sku: "",
    condition: "new",
    description: "",
    warranty_period: "",
    seo_tags: "",
    images: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = "Product title is required";
      if (formData.title.length < 5) newErrors.title = "Title must be at least 5 characters";
      if (formData.title.length > 200) newErrors.title = "Title must be less than 200 characters";
      if (!formData.category_id) newErrors.category = "Category is required";
      if (!formData.brand.trim()) newErrors.brand = "Brand is required";
      if (!formData.model.trim()) newErrors.model = "Model number is required";
    }

    if (currentStep === 2) {
      if (!formData.price) newErrors.price = "Price is required";
      if (parseFloat(formData.price) <= 0) newErrors.price = "Price must be greater than 0";
      if (formData.compare_at_price && parseFloat(formData.compare_at_price) <= 0) {
        newErrors.compare_at_price = "Compare price must be greater than 0";
      }
      if (parseInt(formData.stock_quantity) < 0) newErrors.stock = "Stock cannot be negative";
    }

    if (currentStep === 4) {
      if (imagePreviews.length === 0) newErrors.images = "At least one product image is required";
      if (!formData.seo_tags.trim()) newErrors.seo = "SEO tags are required for searchability";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // File handling
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const processFiles = (files: FileList) => {
    const newFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );

    if (newFiles.length + imagePreviews.length > 5) {
      toast({
        title: "Too many images",
        description: "Maximum 5 images allowed",
        variant: "destructive",
      });
      return;
    }

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const isPrimary = imagePreviews.length === 0;
        setImagePreviews((prev) => [
          ...prev,
          {
            url: e.target?.result as string,
            file,
            isPrimary,
            isUploading: false,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const setPrimaryImage = (index: number) => {
    setImagePreviews((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Ensure at least one is primary
      if (newPreviews.length > 0 && !newPreviews.some((img) => img.isPrimary)) {
        newPreviews[0].isPrimary = true;
      }
      return newPreviews;
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    if (step < 4) {
      setStep(step + 1);
      return;
    }

    // Final submission
    setSaving(true);

    try {
      // Create product
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          seller_id: userId,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          price: parseFloat(formData.price),
          compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
          category_id: formData.category_id,
          stock_quantity: parseInt(formData.stock_quantity) || 0,
          sku: formData.sku.trim() || null,
          brand: formData.brand.trim(),
          model: formData.model.trim(),
          condition: formData.condition,
          warranty_period: formData.warranty_period.trim() || null,
          seo_tags: formData.seo_tags.trim(),
          status: "active",
          is_approved: false,
        })
        .select("id")
        .single();

      if (productError) throw productError;

      // Upload images
      for (let i = 0; i < imagePreviews.length; i++) {
        const preview = imagePreviews[i];
        const ext = preview.file.name.split(".").pop();
        const filePath = `${userId}/${product.id}/${Date.now()}_${i}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, preview.file);

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
          await supabase.from("product_images").insert({
            product_id: product.id,
            image_url: urlData.publicUrl,
            is_primary: preview.isPrimary,
          });
        }
      }

      toast({
        title: "✅ Product submitted for approval",
        description: "Your product will be visible once approved by admin. Average approval time: 24 hours.",
      });

      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error creating product",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isSellerApproved) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your seller account must be approved by the admin before you can list products. Please wait for approval.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add New Product - Amazon-Standard Form</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">Step {step} of 4</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress bar */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: General Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                placeholder="Samsung Galaxy S24 Ultra 5G Smartphone"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category_id} onValueChange={(val) => setFormData({ ...formData, category_id: val })}>
                <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="toys">Toys</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  placeholder="Samsung"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className={errors.brand ? "border-destructive" : ""}
                />
                {errors.brand && <p className="text-sm text-destructive mt-1">{errors.brand}</p>}
              </div>

              <div>
                <Label htmlFor="model">Model Number *</Label>
                <Input
                  id="model"
                  placeholder="SM-S928B"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className={errors.model ? "border-destructive" : ""}
                />
                {errors.model && <p className="text-sm text-destructive mt-1">{errors.model}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Pricing & Inventory */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (NGN) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="50000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={errors.price ? "border-destructive" : ""}
                />
                {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
              </div>

              <div>
                <Label htmlFor="compare">Compare At Price</Label>
                <Input
                  id="compare"
                  type="number"
                  placeholder="60000 (crossed out price)"
                  value={formData.compare_at_price}
                  onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="10"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  className={errors.stock ? "border-destructive" : ""}
                />
                {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock}</p>}
              </div>

              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  placeholder="SKU-12345"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="condition">Condition *</Label>
              <Select value={formData.condition} onValueChange={(val) => setFormData({ ...formData, condition: val as "new" | "refurbished" | "used" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="refurbished">Refurbished</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 3: Technical Specs */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your product in detail. Include features, specifications, and benefits."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="warranty">Warranty Period</Label>
              <Input
                id="warranty"
                placeholder="2 years manufacturer warranty"
                value={formData.warranty_period}
                onChange={(e) => setFormData({ ...formData, warranty_period: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 4: Images & SEO */}
        {step === 4 && (
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label>Product Images (Max 5) *</Label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                  dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/50"
                } ${errors.images ? "border-destructive" : ""}`}
              >
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="font-medium">Drag & drop images here</p>
                <p className="text-sm text-muted-foreground">or click to browse (max 5MB each)</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && processFiles(e.target.files)}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Button variant="outline" size="sm" className="mt-4">
                    Select Files
                  </Button>
                </label>
              </div>
              {errors.images && <p className="text-sm text-destructive mt-1">{errors.images}</p>}

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview.url}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      {preview.isPrimary && (
                        <Badge className="absolute top-2 left-2 gap-1">
                          <Star className="h-3 w-3" /> Primary
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        {!preview.isPrimary && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPrimaryImage(index)}
                            className="gap-1"
                          >
                            <Star className="h-3 w-3" /> Set Main
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeImage(index)}
                          className="gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEO Tags */}
            <div>
              <Label htmlFor="seo">SEO Tags for Google *</Label>
              <Textarea
                id="seo"
                placeholder="Samsung S24, 5G smartphone, Android, gaming phone, camera phone&#10;(separate with commas for better Google indexing)"
                value={formData.seo_tags}
                onChange={(e) => setFormData({ ...formData, seo_tags: e.target.value })}
                rows={4}
              />
              {errors.seo && <p className="text-sm text-destructive mt-1">{errors.seo}</p>}
              <p className="text-xs text-muted-foreground mt-2">
                These tags help customers find your product on Google when searching for "{formData.title || 'similar products'}"
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          <Button 
            onClick={handleSubmit} 
            disabled={saving}
            className={step === 4 ? "bg-accent hover:bg-accent/90" : ""}
          >
            {saving ? "Submitting..." : step === 4 ? "Submit for Approval" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
