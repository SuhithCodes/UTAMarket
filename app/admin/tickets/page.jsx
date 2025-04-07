"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TICKET_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
};

const STATUS_COLORS = {
  [TICKET_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [TICKET_STATUS.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [TICKET_STATUS.RESOLVED]: "bg-green-100 text-green-800",
};

const STATUS_LABELS = {
  [TICKET_STATUS.PENDING]: "Pending",
  [TICKET_STATUS.IN_PROGRESS]: "In Progress",
  [TICKET_STATUS.RESOLVED]: "Resolved",
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    resolvedToday: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    ticketId: null,
    newStatus: null,
    ticketSubject: "",
  });

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/admin/tickets");
      if (!response.ok) throw new Error("Failed to fetch tickets");
      const data = await response.json();
      setTickets(data.tickets);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId, newStatus, ticketSubject) => {
    setConfirmDialog({
      isOpen: true,
      ticketId,
      newStatus,
      ticketSubject,
    });
  };

  const handleStatusChangeConfirm = async () => {
    const { ticketId, newStatus } = confirmDialog;
    try {
      const response = await fetch("/api/admin/tickets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId,
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error("Failed to update ticket status");

      // Refresh tickets after status update
      await fetchTickets();
    } catch (error) {
      console.error("Error updating ticket status:", error);
    } finally {
      setConfirmDialog({
        isOpen: false,
        ticketId: null,
        newStatus: null,
        ticketSubject: "",
      });
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tickets</p>
              <h3 className="text-2xl font-bold">{stats.totalTickets}</h3>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Tickets</p>
              <h3 className="text-2xl font-bold">{stats.openTickets}</h3>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved Today</p>
              <h3 className="text-2xl font-bold">{stats.resolvedToday}</h3>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Ticket List</h2>
            <div className="flex items-center gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickets</SelectItem>
                  <SelectItem value={TICKET_STATUS.PENDING}>Pending</SelectItem>
                  <SelectItem value={TICKET_STATUS.IN_PROGRESS}>
                    In Progress
                  </SelectItem>
                  <SelectItem value={TICKET_STATUS.RESOLVED}>
                    Resolved
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    {ticket.subject}
                  </TableCell>
                  <TableCell>{ticket.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        STATUS_COLORS[ticket.status]
                      }`}
                    >
                      {STATUS_LABELS[ticket.status]}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {ticket.status !== TICKET_STATUS.PENDING && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(
                                  ticket.id,
                                  TICKET_STATUS.PENDING,
                                  ticket.subject
                                )
                              }
                            >
                              Mark as Pending
                            </DropdownMenuItem>
                          )}
                          {ticket.status !== TICKET_STATUS.IN_PROGRESS && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(
                                  ticket.id,
                                  TICKET_STATUS.IN_PROGRESS,
                                  ticket.subject
                                )
                              }
                            >
                              Mark as In Progress
                            </DropdownMenuItem>
                          )}
                          {ticket.status !== TICKET_STATUS.RESOLVED && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(
                                  ticket.id,
                                  TICKET_STATUS.RESOLVED,
                                  ticket.subject
                                )
                              }
                            >
                              Mark as Resolved
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(isOpen) =>
          !isOpen &&
          setConfirmDialog({
            isOpen: false,
            ticketId: null,
            newStatus: null,
            ticketSubject: "",
          })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Ticket Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark the ticket "
              {confirmDialog.ticketSubject}" as{" "}
              {STATUS_LABELS[confirmDialog.newStatus]}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChangeConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
