import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UploadCloud } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { uploadToImgBB } from '../../api/imgbb';

const categories = ['Technology', 'Art', 'Community', 'Health', 'Environment', 'Education'];

const AddCampaign = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    let imageUrl = '';
    setSubmitting(true);
    try {
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadToImgBB(imageFile);
        setUploading(false);
      } else {
        // fallback so the form still works without an imgBB key configured
        imageUrl = `https://picsum.photos/seed/${Date.now()}/800/500`;
      }

      await axiosSecure.post('/campaigns', {
        campaign_title: form.campaign_title.value,
        campaign_story: form.campaign_story.value,
        category: form.category.value,
        funding_goal: form.funding_goal.value,
        minimum_contribution: form.minimum_contribution.value,
        deadline: form.deadline.value,
        reward_info: form.reward_info.value,
        campaign_image_url: imageUrl,
        creator_email: user.email,
        creator_name: user.displayName,
      });

      toast.success('Campaign submitted — waiting on admin approval');
      navigate('/dashboard/my-campaigns');
    } catch (err) {
      toast.error('Could not create campaign');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-ink">Add New Campaign</h1>
      <p className="mt-1 text-sm text-ink/55">Your campaign goes live for supporters once an admin approves it.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div>
          <label className="text-sm font-medium text-ink/80">Campaign title</label>
          <input name="campaign_title" required placeholder="Help us build a solar-powered water pump"
            className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none" />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/80">Campaign story</label>
          <textarea name="campaign_story" required rows={5} placeholder="Tell supporters what you're building and why it matters"
            className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/80">Category</label>
            <select name="category" required
              className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">Deadline</label>
            <input name="deadline" type="date" required min={new Date().toISOString().slice(0, 10)}
              className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/80">Funding goal (credits)</label>
            <input name="funding_goal" type="number" min="1" required placeholder="500"
              className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">Minimum contribution</label>
            <input name="minimum_contribution" type="number" min="1" required placeholder="10"
              className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink/80">Reward info</label>
          <input name="reward_info" required placeholder="Early access, thank-you card, and product credit"
            className="focus-ring mt-1 w-full rounded-lg border border-mist bg-white px-4 py-2.5 text-sm outline-none" />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/80">Cover image</label>
          <label className="focus-ring mt-1 flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-mist bg-white px-4 py-8 text-center">
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="h-32 w-full rounded-lg object-cover" />
            ) : (
              <>
                <UploadCloud className="text-ink/40" size={26} />
                <span className="text-sm text-ink/50">Click to upload a cover image</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <button type="submit" disabled={submitting}
          className="mt-2 rounded-full bg-pine px-6 py-3 text-sm font-semibold text-paper transition hover:bg-pine-dark disabled:opacity-60">
          {uploading ? 'Uploading image…' : submitting ? 'Submitting…' : 'Add Campaign'}
        </button>
      </form>
    </div>
  );
};

export default AddCampaign;
