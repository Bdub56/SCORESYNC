import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function SubjectCreateForm({ onClose, onSubmit, isSubmitting }) {
    const [name, setName] = useState('');
    const [ageYears, setAgeYears] = useState('');
    const [ageMonths, setAgeMonths] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image must be less than 5MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Please enter a name');
            return;
        }
        onSubmit({
            name: name.trim(),
            ageYears: ageYears ? parseFloat(ageYears) : null,
            ageMonths: ageMonths ? parseFloat(ageMonths) : null,
            imageFile
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <Card className="w-full max-w-md p-6 bg-white">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Create New Subject</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter subject name"
                                className="mt-1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="ageYears">Age (Years)</Label>
                                <Input
                                    id="ageYears"
                                    type="number"
                                    min="0"
                                    max="120"
                                    value={ageYears}
                                    onChange={(e) => setAgeYears(e.target.value)}
                                    placeholder="Years"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="ageMonths">Age (Months)</Label>
                                <Input
                                    id="ageMonths"
                                    type="number"
                                    min="0"
                                    max="11"
                                    value={ageMonths}
                                    onChange={(e) => setAgeMonths(e.target.value)}
                                    placeholder="Months"
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="image">Profile Image</Label>
                            <div className="mt-1">
                                {imagePreview ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-32 h-32 rounded-lg object-cover border-2 border-slate-200"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview(null);
                                            }}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-slate-400 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                            <p className="text-sm text-slate-500">Click to upload image</p>
                                            <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                                        </div>
                                        <input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                disabled={isSubmitting || !name.trim()}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Subject'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}