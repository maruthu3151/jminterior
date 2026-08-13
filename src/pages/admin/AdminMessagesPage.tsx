import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { markMessageRead, archiveMessage, deleteMessage } from '../../services/db';
import { Message } from '../../types';
import { MessageSquare, Phone, Mail, Archive, Trash2, CheckCircle2, Send, ExternalLink } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const AdminMessagesPage: React.FC = () => {
  const { messages, showToast } = useData();

  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Read' | 'Archived'>('All');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filtered = messages.filter((m) => {
    if (activeTab === 'Unread') return !m.is_read && !m.is_archived;
    if (activeTab === 'Read') return m.is_read && !m.is_archived;
    if (activeTab === 'Archived') return m.is_archived;
    return !m.is_archived;
  });

  const handleToggleRead = async (msg: Message) => {
    try {
      await markMessageRead(msg.id, !msg.is_read);
      showToast(`Message marked as ${!msg.is_read ? 'Read' : 'Unread'}`, 'success');
    } catch (e) {
      showToast('Error updating message status', 'error');
    }
  };

  const handleToggleArchive = async (msg: Message) => {
    try {
      await archiveMessage(msg.id, !msg.is_archived);
      showToast(`Message ${!msg.is_archived ? 'Archived' : 'Unarchived'}`, 'success');
    } catch (e) {
      showToast('Error archiving message', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      showToast('Message deleted', 'success');
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (e) {
      showToast('Error deleting message', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader
        title="Messages Inbox"
        subtitle="Review client contact submissions, launch WhatsApp replies, or archive messages"
      />

      <div className="px-8 space-y-6">
        {/* Tabs */}
        <div className="flex space-x-2">
          {(['All', 'Unread', 'Read', 'Archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gold-gradient text-charcoal-900 shadow-gold-glow'
                  : 'bg-charcoal-800 text-gray-300 border border-gold-500/20 hover:border-gold-500/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Layout Grid: List + Detail Viewer */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="bg-charcoal-800/80 border border-gold-500/20 rounded-2xl overflow-hidden shadow-lg divide-y divide-gold-500/10">
              {filtered.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.is_read) markMessageRead(msg.id, true);
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedMessage?.id === msg.id
                      ? 'bg-gold-500/10 border-l-4 border-gold-400'
                      : !msg.is_read
                      ? 'bg-charcoal-700/60 font-semibold'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-100 text-sm">{msg.name}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gold-400 font-medium truncate">{msg.subject || 'General Inquiry'}</p>
                  <p className="text-xs text-gray-400 truncate mt-1">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Selected Message Detail Panel */}
            <div className="lg:col-span-2 bg-charcoal-800/80 border border-gold-500/20 rounded-2xl p-6 shadow-lg flex flex-col justify-between min-h-[400px]">
              {selectedMessage ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-gold-500/10 pb-4">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-gray-100">{selectedMessage.name}</h3>
                      <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                        <a href={`tel:${selectedMessage.phone}`} className="hover:text-gold-400 font-semibold flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-gold-400" />
                          <span>{selectedMessage.phone}</span>
                        </a>

                        {selectedMessage.email && (
                          <a href={`mailto:${selectedMessage.email}`} className="hover:text-gold-400 flex items-center space-x-1">
                            <Mail className="w-3.5 h-3.5 text-gold-400" />
                            <span>{selectedMessage.email}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleRead(selectedMessage)}
                        className="px-3 py-1.5 bg-charcoal-900 border border-gold-500/20 text-xs font-semibold text-gold-400 rounded-xl"
                      >
                        {selectedMessage.is_read ? 'Mark Unread' : 'Mark Read'}
                      </button>

                      <button
                        onClick={() => handleToggleArchive(selectedMessage)}
                        className="p-2 bg-charcoal-900 border border-gold-500/20 text-gray-300 rounded-xl hover:text-gold-400"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(selectedMessage.id)}
                        className="p-2 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div>
                    <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block mb-2">
                      Subject: {selectedMessage.subject || 'No Subject Specified'}
                    </span>
                    <p className="text-gray-200 text-sm leading-relaxed p-4 bg-charcoal-900 border border-gold-500/10 rounded-xl whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Reply Action Launchers */}
                  <div className="pt-4 border-t border-gold-500/10 flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/91${selectedMessage.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedMessage.name)},%20this%20is%20K.%20Selvam%20from%20JM%20INTERIOR%20replying%20to%20your%20message.`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Reply via WhatsApp</span>
                    </a>

                    {selectedMessage.email && (
                      <a
                        href={`mailto:${selectedMessage.email}?subject=RE:%20${encodeURIComponent(selectedMessage.subject || 'JM Interior Inquiry')}`}
                        className="px-5 py-2.5 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 rounded-xl text-xs font-bold flex items-center space-x-2"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Reply via Email</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400 space-y-2">
                  <MessageSquare className="w-10 h-10 text-gold-400/40" />
                  <p className="text-xs">Select a message from the list on the left to view details and launch replies.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="Inbox Empty"
            description="Messages submitted via the contact form on your website will appear here."
          />
        )}
      </div>
    </div>
  );
};
