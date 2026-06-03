"use client";

import { useEffect, useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Calendar as CalendarIcon,
  PartyPopper,
} from "lucide-react";

interface CalendarEvent {
  date: string;
  label: string;
  type: "occasion" | "gift-given";
  recipientName?: string;
  giftTitle?: string;
  category?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadEvents() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const calendarEvents: CalendarEvent[] = [];

      const { data: recipients } = await supabase
        .from("recipients")
        .select("name, important_dates")
        .eq("user_id", user.id);

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

      const { data: givenGifts } = await supabase
        .from("gift_ideas")
        .select("title, given_date, category")
        .eq("user_id", user.id)
        .eq("is_given", true)
        .not("given_date", "is", null);

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

      setEvents(calendarEvents);
      setLoading(false);
    }
    loadEvents();
  }, [supabase]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return days;
  }, [currentMonth, currentYear]);

  function getEventsForDay(day: number) {
    const monthStr = String(currentMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

    return events.filter((e) => {
      if (e.type === "occasion") {
        const parts = e.date.split("-");
        if (parts.length >= 2) {
          const eventMonth = parts[parts.length - 2];
          const eventDay = parts[parts.length - 1];
          return eventMonth === monthStr && eventDay === dayStr;
        }
      }
      return e.date === dateStr;
    });
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
    ? events.filter((e) => {
        if (e.type === "occasion") {
          const parts = e.date.split("-");
          const selParts = selectedDate.split("-");
          return (
            parts[parts.length - 2] === selParts[1] &&
            parts[parts.length - 1] === selParts[2]
          );
        }
        return e.date === selectedDate;
      })
    : [];

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
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Gift Calendar</h1>
        <p className="text-text-secondary mt-1">
          Track important dates and gift-giving history
        </p>
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
            const monthStr = String(currentMonth + 1).padStart(2, "0");
            const dayStr = String(day).padStart(2, "0");
            const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`p-1.5 min-h-[72px] text-left rounded-lg transition-colors ${
                  isSelected
                    ? "bg-primary-50 ring-2 ring-primary-500"
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
                        evt.type === "occasion"
                          ? "bg-accent-100 text-accent-700"
                          : "bg-primary-100 text-primary-700"
                      }`}
                    >
                      {evt.type === "occasion"
                        ? evt.recipientName
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

      {selectedDate && selectedEvents.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Events on {selectedDate}
          </h3>
          <div className="space-y-3">
            {selectedEvents.map((evt, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-surface-secondary"
              >
                <div
                  className={`p-2 rounded-lg ${
                    evt.type === "occasion"
                      ? "bg-accent-100 text-accent-600"
                      : "bg-primary-100 text-primary-600"
                  }`}
                >
                  {evt.type === "occasion" ? (
                    <PartyPopper className="h-4 w-4" />
                  ) : (
                    <Gift className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {evt.type === "occasion"
                      ? `${evt.recipientName}'s ${evt.label}`
                      : evt.giftTitle}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {evt.type === "occasion"
                      ? "Upcoming occasion"
                      : "Gift given"}
                  </p>
                </div>
                {evt.category && (
                  <Badge category={evt.category}>{evt.category}</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {selectedDate && selectedEvents.length === 0 && (
        <Card className="text-center py-6">
          <CalendarIcon className="h-8 w-8 text-text-tertiary mx-auto mb-2" />
          <p className="text-sm text-text-secondary">
            No events on this date
          </p>
        </Card>
      )}
    </div>
  );
}
