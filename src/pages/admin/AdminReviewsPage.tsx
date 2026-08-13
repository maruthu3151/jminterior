import React from 'react';
import { useData } from '../../context/DataContext';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { updateReviewStatus, togglePinReview, deleteReview } from '../../services/db';
import { Review } from '../../types';
import { Star, CheckCircle, XCircle, Pin, Trash2 } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const AdminReviewsPage: React.FC = () => {
  const { allReviews, showToast } = useData();

  const handleStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      await updateReviewStatus(id, status);
      showToast(`Review ${status}`, 'success');
    } catch (e) {
      showToast('Error updating review status', 'error');
    }
  };

  const handlePin = async (id: string) => {
    try {
      await togglePinReview(id);
      showToast('Review pinned status updated', 'success');
    } catch (e) {
      showToast('Error pinning review', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id);
      showToast('Review deleted', 'success');
    } catch (e) {
      showToast('Error deleting review', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Reviews Moderation Queue"
        subtitle="Approve client testimonials to publish on your website or pin top reviews"
      />

      <div className="px-8 space-y-6">
        {allReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-charcoal-800/80 border border-gold-500/20 rounded-2xl p-6 shadow-lg flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-gold-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-gold-400' : 'text-gray-600'}`} />
                      ))}
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        rev.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : rev.status === 'Pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>

                  <p className="text-gray-200 text-sm leading-relaxed italic mb-3">"{rev.comment}"</p>
                  <div className="text-xs text-gray-400">
                    <strong className="text-gray-200">{rev.client_name}</strong> • {rev.location || 'Chennai'}
                  </div>
                </div>

                <div className="pt-3 border-t border-gold-500/10 flex items-center justify-between">
                  <button
                    onClick={() => handlePin(rev.id)}
                    className={`text-xs font-semibold flex items-center space-x-1 ${
                      rev.is_pinned ? 'text-gold-400 font-bold' : 'text-gray-400'
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5" />
                    <span>{rev.is_pinned ? 'Pinned to Top' : 'Pin Review'}</span>
                  </button>

                  <div className="flex space-x-2">
                    {rev.status !== 'Approved' && (
                      <button
                        onClick={() => handleStatus(rev.id, 'Approved')}
                        className="px-3 py-1 bg-emerald-600/30 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30 flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {rev.status !== 'Rejected' && (
                      <button
                        onClick={() => handleStatus(rev.id, 'Rejected')}
                        className="px-3 py-1 bg-amber-600/20 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/30 flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-1 text-red-400 hover:bg-red-950/40 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Star}
            title="No Reviews Submitted"
            description="Client reviews submitted on the public website will appear here for admin approval."
          />
        )}
      </div>
    </div>
  );
};
