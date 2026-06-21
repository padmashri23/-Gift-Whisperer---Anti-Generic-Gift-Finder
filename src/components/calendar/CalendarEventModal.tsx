"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { X, Cake, Heart, PartyPopper, Bell, StickyNote, Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface UserCalendarEvent {
  id: string;
  title: string;
  event_date: string;
  event_type: string;
  notes: string | null;
  is_recurring: boolean;
}

interface CalendarEventModalProps {
  /** Pre-selected date (YYYY-MM-DD) when creating a new event. */
  date: string;
  /** Existing event when editing; omit to create a new one. */
  existing?: UserCalendarEvent;
  onClose: () => void;
  onSaved: () => void;
}

const EVENT_TYPE_OPTIONS = [
  { value: "birthday", label: "Birthday", icon: Cake },
  { value: "anniversary", label: "Anniversary", icon: Heart },
  { value: "occasion", label: "Occasion", icon: PartyPopper },
  { value: "reminder", label: "Reminder", icon: Bell },
  { value: "note", label: "Note", icon: StickyNote },
] as const;

export default function CalendarEventModal({
  date,
  existing,
  onClose,
  onSaved,
}: CalendarEventModalProps) {
  const isEditing = !!existing;
  const [title, setTitle] = useState(existing?.title ?? "");
  const [eventDate, setEventDate] = useState(existing?.event_date ?? date);
  const [eventType, setEventType] = useState(existing?.event_type ?? "occasion");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [isRecurring, setIsRecurring] = useState(existing?.is_recurring ?? false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave() {
    if (title.trim().length === 0) {
      toast.error("Please give this event a title");
      return;
    }

    setSaving(true);
    try {
      const url = isEditing
        ? `/api/calendar/events/${existing!.id}`
        : "/api/calendar/events";
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          event_date: eventDate,
          event_type: eventType,
          notes: notes.trim() || null,
          is_recurring: isRecurring,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save event");

      toast.success(isEditing ? "Event updated!" : "Event added to calendar!");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existing) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/calendar/events/${existing.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete event");
      }
      toast.success("Event deleted");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              {isEditing ? "Edit event" : "Add an event"}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-tertiary hover:bg-surface-secondary hover:text-text-secondary"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <Input
              id="event-title"
              label="What's the occasion?"
              placeholder="e.g. Mom's birthday, Wedding anniversary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Type
              </label>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = eventType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setEventType(opt.value)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        active
                          ? "bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/30 dark:text-primary-100"
                          : "bg-[var(--input-bg)] border-border text-text-secondary hover:bg-surface-secondary"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Input
              id="event-date"
              label="Date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />

            <Textarea
              id="event-notes"
              label="Notes (optional)"
              placeholder="Gift ideas, sizes, reminders, anything you want to remember..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={1000}
            />

            <button
              type="button"
              onClick={() => setIsRecurring((v) => !v)}
              className="flex w-full items-center gap-3 rounded-lg border border-border bg-[var(--input-bg)] px-4 py-2.5 text-left hover:bg-surface-secondary transition-colors"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-text-primary">
                  Repeat every year
                </span>
                <span className="block text-xs text-text-tertiary">
                  Great for birthdays and anniversaries
                </span>
              </span>
              <span
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  isRecurring ? "bg-primary-600" : "bg-surface-tertiary"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    isRecurring ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>

            <div className="flex items-center justify-between gap-2 pt-1">
              {isEditing ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  loading={deleting}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} loading={saving}>
                  {isEditing ? "Save changes" : "Add event"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
