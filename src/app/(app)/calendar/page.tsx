"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import CalendarEventModal, {
  type UserCalendarEvent,
} from "@/components/calendar/CalendarEventModal";
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Calendar as CalendarIcon,
  PartyPopper,
  Plus,
  Pencil,
  Cake,
  Heart,
  Bell,
  StickyNote,
  Repeat,
} from "lucide-react";

interface CalendarEvent {
  date: string;
  label: string;
  type: "occasion" | "gift-given" | "custom";
  recipientName?: string;
  giftTitle?: string;
  category?: string;
  isRecurring?: boolean;
  notes?: string | null;
  eventType?: string;
  userEvent?: UserCalendarEvent;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TYPE_ICONS: Record<string, typeof Cake> = {
  birthday: Cake,
  anniversary: Heart,
  occasion: PartyPopper,
  reminder: Bell,
  note: StickyNote,
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<UserCalendarEvent | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshEvents = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        if (active) setLoading(false);
        return;
      }

      const userId = session.user.id;
      const calendarEvents: CalendarEvent[] = [];

      const [{ data: recipients }, { data: givenGifts }, { data: userEvents }] =
        await Promise.all([
          supabase
            .from("recipients")
            .select("name, important_dates")
            .eq("user_id", userId),
          supabase
            .from("gift_ideas")
            .select("title, given_date, category")
            .eq("user_id", userId)
            .eq("is_given", true)
            .not("given_date", "is", null),
          supabase
            .from("calendar_events")
            .select("*")
            .eq("user_id", userId),
        ]);

      if (recipients) {
        for (const r of recipients) {
          if (r.important_dates && Array.isArray(r.important_dates)) {
            for (const d of r.important_dates) {
              const dateObj = d as { label: string; date: string };
              if (dateObj.date) {
                calendarEvents.push({
                  date: dateObj.date,
                  label: dateObj.label || "Event",
                  type: "occasion",
                  recipientName: r.name,
                });
              }
            }
          }
        }
      }

      if (givenGifts) {
        for (const g of givenGifts) {
          calendarEvents.push({
            date: g.given_date!,
            label: "Gift given",
            type: "gift-given",
            giftTitle: g.title,
            category: g.category,
          });
        }
      }

      if (userEvents) {
        for (const ev of userEvents as UserCalendarEvent[]) {
          calendarEvents.push({
            date: ev.event_date,
            label: ev.title,
            type: "custom",
            isRecurring: ev.is_recurring,
            notes: ev.notes,
            eventType: ev.event_type,
            userEvent: ev,
          });
        }
      }

      if (active) {
        setEvents(calendarEvents);
        setLoading(false);
      }
    }

    loadEvents();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return days;
  }, [currentMonth, currentYear]);

  // Recurring occasions/birthdays match by month-day; one-off events match the exact date.
  const eventMatchesDate = useCallback(
    (e: CalendarEvent, dateStr: string) => {
      const selParts = dateStr.split("-");
      const mm = selParts[1];
      const dd = selParts[2];
      const recurringMatch = () => {
        const parts = e.date.split("-");
        return (
          parts[parts.length - 2] === mm && parts[parts.length - 1] === dd
        );
      };
      if (e.type === "occasion") return recurringMatch();
      if (e.type === "custom") return e.isRecurring ? recurringMatch() : e.date === dateStr;
      return e.date === dateStr;
    },
    []
  );

  function getEventsForDay(day: number) {
    const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
    return events.filter((e) => eventMatchesDate(e, dateStr));
  }

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  }

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const selectedEvents = selectedDate
    ? events.filter((e) => eventMatchesDate(e, selectedDate))
    : [];

  function openNewEvent() {
    setEditingEvent(null);
    setModalOpen(true);
  }

  function openEditEvent(ev: UserCalendarEvent) {
    setEditingEvent(ev);
    setModalOpen(true);
  }

  const prettyDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-text-primary">Gift Calendar</h1>
        <Card className="animate-pulse h-96" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gift Calendar</h1>
          <p className="text-text-secondary mt-1">
            Save birthdays, anniversaries, and special occasions — and never miss a gift
          </p>
        </div>
        <Button size="sm" onClick={openNewEvent}>
          <Plus className="h-4 w-4" />
          Add event
        </Button>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold text-text-primary">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h2>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-px">
          {DAY_NAMES.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-text-tertiary py-2"
            >
              {d}
            </div>
          ))}

          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="p-2 min-h-[72px]" />;
            }

            const dayEvents = getEventsForDay(day);
            const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`p-1.5 min-h-[72px] text-left rounded-lg transition-colors ${
                  isSelected
                    ? "bg-primary-50 ring-2 ring-primary-500 dark:bg-primary-900/30"
                    : "hover:bg-surface-secondary"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                    isToday(day)
                      ? "bg-primary-600 text-white"
                      : "text-text-primary"
                  }`}
                >
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map((evt, j) => (
                    <div
                      key={j}
                      className={`text-[10px] truncate rounded px-1 py-0.5 ${
                        evt.type === "custom"
                          ? "bg-success/15 text-success"
                          : evt.type === "occasion"
                          ? "bg-accent-100 text-accent-700"
                          : "bg-primary-100 text-primary-700"
                      }`}
                    >
                      {evt.type === "occasion"
                        ? evt.recipientName
                        : evt.type === "custom"
                        ? evt.label
                        : evt.giftTitle}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-text-tertiary px-1">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {selectedDate && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">
              {prettyDate(selectedDate)}
            </h3>
            <Button variant="secondary" size="sm" onClick={openNewEvent}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="text-center py-6">
              <CalendarIcon className="h-8 w-8 text-text-tertiary mx-auto mb-2" />
              <p className="text-sm text-text-secondary">
                Nothing here yet. Add a birthday, occasion, or note for this day.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((evt, i) => {
                const Icon =
                  evt.type === "custom"
                    ? TYPE_ICONS[evt.eventType ?? "occasion"] ?? PartyPopper
                    : evt.type === "occasion"
                    ? PartyPopper
                    : Gift;
                const editable = evt.type === "custom" && evt.userEvent;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-surface-secondary"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        evt.type === "custom"
                          ? "bg-success/15 text-success"
                          : evt.type === "occasion"
                          ? "bg-accent-100 text-accent-600"
                          : "bg-primary-100 text-primary-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                        {evt.type === "occasion"
                          ? `${evt.recipientName}'s ${evt.label}`
                          : evt.type === "custom"
                          ? evt.label
                          : evt.giftTitle}
                        {evt.isRecurring && (
                          <Repeat className="h-3 w-3 text-text-tertiary" />
                        )}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 capitalize">
                        {evt.type === "custom"
                          ? evt.eventType
                          : evt.type === "occasion"
                          ? "Upcoming occasion"
                          : "Gift given"}
                      </p>
                      {evt.notes && (
                        <p className="text-xs text-text-secondary mt-1.5 whitespace-pre-wrap">
                          {evt.notes}
                        </p>
                      )}
                    </div>
                    {editable ? (
                      <button
                        onClick={() => openEditEvent(evt.userEvent!)}
                        className="p-1.5 rounded-lg text-text-tertiary hover:bg-surface-tertiary hover:text-text-secondary shrink-0"
                        title="Edit event"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    ) : (
                      evt.category && (
                        <Badge category={evt.category}>{evt.category}</Badge>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {modalOpen && (
        <CalendarEventModal
          date={selectedDate ?? `${currentYear}-${pad(currentMonth + 1)}-${pad(today.getDate())}`}
          existing={editingEvent ?? undefined}
          onClose={() => setModalOpen(false)}
          onSaved={refreshEvents}
        />
      )}
    </div>
  );
}
