import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  User,
  Phone,
  MessageSquare,
  Calendar,
  Filter,
  Search,
  Eye,
  Trash2,
  Archive,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { contactAPI } from "../../utils/api";
import { useNotification } from "../Common/Notification";
import ConfirmModal from "../Common/ConfirmModal";

const ContactContent = () => {
  const { success, error: showError } = useNotification();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: null, message: "", type: "warning" });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [filter, page]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const status = filter !== "all" ? filter : "";
      const params = {
        status: status || undefined,
        page,
        limit: 10,
        sort: "-createdAt",
      };
      const data = await contactAPI.getAllContacts(params);
      if (data.success) {
        setContacts(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      showError("Failed to fetch contacts. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await contactAPI.getContactStats();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const updateContactStatus = async (id, status, adminNotes) => {
    try {
      const data = await contactAPI.updateContactStatus(id, status, adminNotes);
      if (data.success) {
        fetchContacts();
        fetchStats();
        // Update selected contact if modal is open
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact(data.data);
        }
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      showError("Failed to update contact status");
    }
  };

  const deleteContact = async (id) => {
    setConfirmModal({
      isOpen: true,
      message: "Are you sure you want to delete this contact message?",
      type: "danger",
      onConfirm: async () => {
        try {
          const data = await contactAPI.deleteContact(id);
          if (data.success) {
            fetchContacts();
            fetchStats();
            if (selectedContact && selectedContact._id === id) {
              setIsDetailModalOpen(false);
              setSelectedContact(null);
            }
            success("Contact deleted successfully");
          }
        } catch (error) {
          console.error("Error deleting contact:", error);
          showError("Failed to delete contact");
        }
      },
    });
  };

  const openDetailModal = async (contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
    // Mark as read if it's new
    if (contact.status === "new") {
      await updateContactStatus(contact._id, "read");
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.mobile.includes(query) ||
      contact.message.toLowerCase().includes(query)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "read":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "replied":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "archived":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-[#080808] border-b border-white/10 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 truncate text-white">Contact Messages</h2>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base">Manage all contact form submissions</p>
          </div>
          <button
            onClick={() => {
              fetchContacts();
              fetchStats();
            }}
            className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors flex-shrink-0"
            aria-label="Refresh"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2 sm:p-3 md:p-4"
          >
            <div className="text-purple-400 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Total</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">{stats.total}</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 sm:p-3 md:p-4"
          >
            <div className="text-blue-400 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">New</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">{stats.new}</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 sm:p-3 md:p-4"
          >
            <div className="text-yellow-400 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Read</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">{stats.read}</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 sm:p-3 md:p-4"
          >
            <div className="text-green-400 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Replied</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">{stats.replied}</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-2 sm:p-3 md:p-4"
          >
            <div className="text-gray-400 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">Archived</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">{stats.archived}</div>
          </motion.div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, mobile, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
              style={{
                color: 'white',
              }}
            >
              <option value="all" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>All Messages</option>
              <option value="new" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>New</option>
              <option value="read" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Read</option>
              <option value="replied" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Replied</option>
              <option value="archived" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 animate-spin" />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-base sm:text-lg">No contact messages found</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredContacts.map((contact) => (
              <motion.div
                key={contact._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => openDetailModal(contact)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white text-sm sm:text-base truncate">{contact.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-400 truncate">{contact.email}</p>
                      </div>
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(
                          contact.status
                        )}`}
                      >
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm mb-2 line-clamp-2">
                      {contact.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{contact.mobile}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="hidden sm:inline">{formatDate(contact.createdAt)}</span>
                        <span className="sm:hidden">{new Date(contact.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => updateContactStatus(contact._id, "read")}
                        className="p-1.5 sm:p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors"
                        title="Mark as Read"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => updateContactStatus(contact._id, "replied")}
                        className="p-1.5 sm:p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-colors"
                        title="Mark as Replied"
                      >
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                      </button>
                      <button
                        onClick={() => updateContactStatus(contact._id, "archived")}
                        className="p-1.5 sm:p-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg transition-colors hidden sm:block"
                        title="Archive"
                      >
                        <Archive className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => deleteContact(contact._id)}
                        className="p-1.5 sm:p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
            <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              Showing {((page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} messages
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsDetailModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/20 rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden mx-2 sm:mx-0"
            >
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-[#1a1a1a] border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Contact Details</h3>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto scrollbar-hide px-4 sm:px-6 py-4 sm:py-6">
                <div className="space-y-3 sm:space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    <span className="text-xs sm:text-sm text-gray-400">Name</span>
                  </div>
                  <p className="text-white font-medium text-sm sm:text-base">{selectedContact.name}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-400">Email</span>
                  </div>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {selectedContact.email}
                  </a>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-400">Mobile</span>
                  </div>
                  <a
                    href={`tel:${selectedContact.mobile}`}
                    className="text-green-400 hover:text-green-300"
                  >
                    {selectedContact.mobile}
                  </a>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-pink-400" />
                    <span className="text-sm text-gray-400">Message</span>
                  </div>
                  <p className="text-white whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-gray-400">Date</span>
                  </div>
                  <p className="text-white">{formatDate(selectedContact.createdAt)}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-400">Status</span>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      selectedContact.status
                    )}`}
                  >
                    {selectedContact.status}
                  </span>
                </div>

                {selectedContact.adminNotes && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-purple-400" />
                      <span className="text-sm text-gray-400">Admin Notes</span>
                    </div>
                    <p className="text-white">{selectedContact.adminNotes}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      updateContactStatus(selectedContact._id, "read");
                      setIsDetailModalOpen(false);
                    }}
                    className="flex-1 min-w-[120px] px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => {
                      updateContactStatus(selectedContact._id, "replied");
                      setIsDetailModalOpen(false);
                    }}
                    className="flex-1 min-w-[120px] px-3 sm:px-4 py-2 text-sm sm:text-base bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition-colors"
                  >
                    Mark as Replied
                  </button>
                  <button
                    onClick={() => {
                      updateContactStatus(selectedContact._id, "archived");
                      setIsDetailModalOpen(false);
                    }}
                    className="flex-1 min-w-[100px] px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg text-gray-400 transition-colors"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => {
                      deleteContact(selectedContact._id);
                      setIsDetailModalOpen(false);
                    }}
                    className="px-3 sm:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm || (() => {})}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </div>
  );
};

export default ContactContent;
