"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSWR from "swr";
import { toast } from "sonner";
import { 
  Palette, 
  Upload, 
  Save,
  Loader2,
  AlertTriangle,
  Trash2,
  Type,
  Eye,
  Moon,
  Sun
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Form validation schema
const ThemeSettingsFormSchema = z.object({
  themeName: z.string().min(1, "Theme name is required"),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  tertiaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  font: z.string(),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").optional(),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").optional(),
  mode: z.enum(['LIGHT', 'DARK']),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Font options
const fonts = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'open-sans', label: 'Open Sans' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'lato', label: 'Lato' },
  { value: 'source-sans-pro', label: 'Source Sans Pro' },
];

export default function ThemeSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [showThemePreview, setShowThemePreview] = useState(false);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  const { data, error, mutate } = useSWR('/api/site-settings/theme', fetcher);

  const form = useForm<z.infer<typeof ThemeSettingsFormSchema>>({
    resolver: zodResolver(ThemeSettingsFormSchema),
    defaultValues: {
      themeName: 'Default Theme',
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      tertiaryColor: '#8b5cf6',
      font: 'inter',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      mode: 'LIGHT',
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (data?.data) {
      const theme = data.data;
      form.reset({
        themeName: theme.themeName || 'Default Theme',
        primaryColor: theme.primaryColor || '#3b82f6',
        secondaryColor: theme.secondaryColor || '#10b981',
        tertiaryColor: theme.tertiaryColor || '#8b5cf6',
        font: theme.font || 'inter',
        backgroundColor: theme.backgroundColor || '#ffffff',
        textColor: theme.textColor || '#000000',
        mode: theme.mode || 'LIGHT',
      });
      setLogoPreview(theme.logoUrl || null);
      setFaviconPreview(theme.faviconUrl || null);
    }
  }, [data, form]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Logo file size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setLogoFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit for favicon
        toast.error('Favicon file size must be less than 1MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFaviconPreview(result);
        setFaviconFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
  };

  const removeFavicon = () => {
    setFaviconPreview(null);
    setFaviconFile(null);
  };

  const onSubmit = async (values: z.infer<typeof ThemeSettingsFormSchema>) => {
    setIsLoading(true);
    
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Append all form values
      Object.keys(values).forEach(key => {
        formData.append(key, values[key as keyof typeof values] as string);
      });
      
      // Append files if they exist
      if (logoFile) formData.append('logo', logoFile);
      if (faviconFile) formData.append('favicon', faviconFile);
      
      const response = await fetch('/api/site-settings/theme', {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Theme settings updated successfully');
        mutate(); // Refresh the data
      } else {
        toast.error(result.error || 'Failed to update theme settings');
      }
    } catch (error) {
      console.error('Error updating theme settings:', error);
      toast.error('Failed to update theme settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Get current theme values for preview
  const currentTheme = {
    primaryColor: form.watch('primaryColor') || '#3b82f6',
    secondaryColor: form.watch('secondaryColor') || '#10b981',
    tertiaryColor: form.watch('tertiaryColor') || '#8b5cf6',
    backgroundColor: form.watch('backgroundColor') || '#ffffff',
    textColor: form.watch('textColor') || '#000000',
    font: form.watch('font') || 'inter',
    mode: form.watch('mode') || 'LIGHT',
  };

  if (error) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Failed to load theme settings. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Theme Settings</h1>
        <p className="text-gray-600 mt-1">Customize the appearance of your application</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Theme Information Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme Information
                  </CardTitle>
                  <CardDescription>
                    Configure your theme's basic details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="themeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter theme name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme Mode</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select theme mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LIGHT">
                              <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                Light
                              </div>
                            </SelectItem>
                            <SelectItem value="DARK">
                              <div className="flex items-center gap-2">
                                <Moon className="h-4 w-4" />
                                Dark
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Color Settings Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Color Settings</CardTitle>
                  <CardDescription>
                    Customize your theme's color palette
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              type="color"
                              className="w-12 h-10 p-1 border rounded"
                              {...field}
                            />
                            <Input
                              placeholder="#3b82f6"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              type="color"
                              className="w-12 h-10 p-1 border rounded"
                              {...field}
                            />
                            <Input
                              placeholder="#10b981"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tertiaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tertiary Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              type="color"
                              className="w-12 h-10 p-1 border rounded"
                              {...field}
                            />
                            <Input
                              placeholder="#8b5cf6"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="backgroundColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              type="color"
                              className="w-12 h-10 p-1 border rounded"
                              {...field}
                            />
                            <Input
                              placeholder="#ffffff"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="textColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Text Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              type="color"
                              className="w-12 h-10 p-1 border rounded"
                              {...field}
                            />
                            <Input
                              placeholder="#000000"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Branding Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                  <CardDescription>
                    Upload your logo and favicon
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <Label>Logo</Label>
                    <div className="mt-2">
                      {logoPreview ? (
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="h-16 w-16 object-cover rounded-lg border"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('logo-upload')?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Change Logo
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={removeLogo}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                          >
                            Upload Logo
                          </Button>
                          <p className="text-sm text-gray-500 mt-2">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      )}
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Favicon Upload */}
                  <div>
                    <Label>Favicon</Label>
                    <div className="mt-2">
                      {faviconPreview ? (
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={faviconPreview}
                              alt="Favicon preview"
                              className="h-8 w-8 object-cover rounded border"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('favicon-upload')?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Change Favicon
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={removeFavicon}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('favicon-upload')?.click()}
                          >
                            Upload Favicon
                          </Button>
                          <p className="text-xs text-gray-500 mt-1">
                            ICO, PNG up to 1MB
                          </p>
                        </div>
                      )}
                      <input
                        id="favicon-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFaviconUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Typography Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Typography
                  </CardTitle>
                  <CardDescription>
                    Customize your theme's typography
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="font"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Font Family</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select font" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fonts.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Theme Preview Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Theme Preview
                  </CardTitle>
                  <CardDescription>
                    Preview your theme settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Show Preview</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={showThemePreview} 
                        onCheckedChange={setShowThemePreview}
                      />
                      <span className="text-sm">{showThemePreview ? 'On' : 'Off'}</span>
                    </div>
                  </div>

                  {showThemePreview && (
                    <div 
                      className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        color: currentTheme.textColor,
                        fontFamily: `var(--font-${currentTheme.font})`,
                      }}
                    >
                      <h3 className="font-semibold mb-2">Theme Preview</h3>
                      <div className="space-y-2">
                        <div 
                          className="p-2 rounded text-sm"
                          style={{ backgroundColor: currentTheme.primaryColor, color: 'white' }}
                        >
                          Primary Color
                        </div>
                        <div 
                          className="p-2 rounded text-sm"
                          style={{ backgroundColor: currentTheme.secondaryColor, color: 'white' }}
                        >
                          Secondary Color
                        </div>
                        <div 
                          className="p-2 rounded text-sm"
                          style={{ backgroundColor: currentTheme.tertiaryColor, color: 'white' }}
                        >
                          Tertiary Color
                        </div>
                        <p className="text-sm">
                          This is how text will appear with your selected font and colors.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Theme
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}