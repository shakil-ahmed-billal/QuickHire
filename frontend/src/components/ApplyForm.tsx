'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ApplyFormProps {
  jobId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ApplyForm({ jobId, onSuccess, onCancel }: ApplyFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    resumeUrl: '',
    coverNote: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/applications', {
        jobId,
        ...formData,
      });

      if (res.data.success) {
        toast.success('Your application has been submitted successfully!');
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      if (error.errorSources && error.errorSources.length > 0) {
        toast.error(error.errorSources[0].message);
      } else {
        toast.error(error.message || 'Failed to submit application');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="applicantName">Full Name</Label>
        <Input 
          id="applicantName" 
          name="applicantName" 
          placeholder="John Doe" 
          required 
          value={formData.applicantName}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="applicantEmail">Email Address</Label>
        <Input 
          id="applicantEmail" 
          name="applicantEmail" 
          type="email" 
          placeholder="john@example.com" 
          required 
          value={formData.applicantEmail}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resumeUrl">Resume/Portfolio URL (Optional)</Label>
        <Input 
          id="resumeUrl" 
          name="resumeUrl" 
          type="url" 
          placeholder="https://linkedin.com/in/johndoe" 
          value={formData.resumeUrl}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverNote">Cover Note (Optional)</Label>
        <Textarea 
          id="coverNote" 
          name="coverNote" 
          placeholder="Tell us why you're a great fit for this role..." 
          className="min-h-[120px]"
          value={formData.coverNote}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </form>
  );
}
