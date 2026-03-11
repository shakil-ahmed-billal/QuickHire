'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AdminJobFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

export function AdminJobForm({ onSuccess, onCancel, initialData }: AdminJobFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    type: initialData?.type || 'FULL_TIME',
    categoryId: initialData?.categoryId || '',
    salary: initialData?.salary || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
  });

  useEffect(() => {
    api.get('/categories').then(res => {
      if(res.data.success) {
        setCategories(res.data.data.map((c: any) => ({ id: c.id, name: c.name })));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await api.patch(`/jobs/${initialData.id}`, formData);
        toast.success('Job updated successfully');
      } else {
        await api.post('/jobs', formData);
        toast.success('Job created successfully');
      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      if (error.errorSources && error.errorSources.length > 0) {
        toast.error(error.errorSources[0].message);
      } else {
        toast.error(error.message || 'Failed to save job');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input id="title" name="title" required value={formData.title} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" required value={formData.company} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" required value={formData.location} onChange={handleChange} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={formData.categoryId} onValueChange={(val) => setFormData(p => ({...p, categoryId: val || ''}))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Job Type</Label>
          <Select value={formData.type} onValueChange={(val) => setFormData(p => ({...p, type: val || 'FULL_TIME'}))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FULL_TIME">Full Time</SelectItem>
              <SelectItem value="PART_TIME">Part Time</SelectItem>
              <SelectItem value="REMOTE">Remote</SelectItem>
              <SelectItem value="INTERNSHIP">Internship</SelectItem>
              <SelectItem value="CONTRACT">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salary">Salary (Optional)</Label>
          <Input id="salary" name="salary" placeholder="e.g. $80k - $100k" value={formData.salary} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline (Optional)</Label>
          <Input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          required 
          className="min-h-[100px]"
          value={formData.description} 
          onChange={handleChange} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements (Optional)</Label>
        <Textarea 
          id="requirements" 
          name="requirements" 
          className="min-h-[100px]"
          value={formData.requirements} 
          onChange={handleChange} 
        />
      </div>

      <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-background pb-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Update Job' : 'Create Job')}
        </Button>
      </div>
    </form>
  );
}
