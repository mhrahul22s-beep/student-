import { useState } from 'react';
import { MobileHeader, MobileNav, Sidebar } from '@/components/Navigation';
import { Button, Modal } from '@/components/ui';
import { ToastViewport } from '@/components/ToastViewport';
import { useAppState } from '@/hooks/useAppState';
import { useSoundPreference } from '@/hooks/useSoundPreference';
import { useToasts } from '@/hooks/useToasts';
import { playCompletionChime } from '@/lib/sound';
import { knownSubjects } from '@/lib/stats';
import AssignmentsPage from '@/pages/AssignmentsPage';
import AttendancePage from '@/pages/AttendancePage';
import DashboardPage from '@/pages/DashboardPage';
import PlannerPage from '@/pages/PlannerPage';
import type { AttendanceInput, TaskInput, View } from '@/types';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [resetOpen, setResetOpen] = useState(false);
  const app = useAppState();
  const { state } = app;
  const { toasts, notify, dismiss } = useToasts();
  const sound = useSoundPreference();
  const subjects = knownSubjects(state);
  const closeReset = () => setResetOpen(false);

  const handleAddTask = (input: TaskInput) => {
    app.addTask(input);
    notify(`Assignment added: "${input.title.trim()}"`);
  };

  const handleToggleTask = (id: string) => {
    const task = state.tasks.find(item => item.id === id);
    app.toggleTask(id);
    if (!task) return;
    if (task.completed) {
      notify(`Marked "${task.title}" as pending`);
    } else {
      notify(`Completed "${task.title}"`);
      if (sound.enabled) playCompletionChime();
    }
  };

  const handleDeleteTask = (id: string) => {
    const task = state.tasks.find(item => item.id === id);
    app.deleteTask(id);
    if (task) notify(`Deleted assignment: "${task.title}"`);
  };

  const handleSaveAttendance = (id: string | null, input: AttendanceInput) => {
    app.saveAttendance(id, input);
    notify(id ? `Updated attendance for ${input.subject}` : `Added attendance for ${input.subject}`);
  };

  const handleDeleteAttendance = (id: string) => {
    const record = state.attendance.find(item => item.id === id);
    app.deleteAttendance(id);
    if (record) notify(`Deleted attendance record for ${record.subject}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-navy-900">
      <Sidebar
        active={view}
        onChange={setView}
        onReset={() => setResetOpen(true)}
        soundEnabled={sound.enabled}
        onToggleSound={sound.toggle}
      />
      <div className="lg:ml-64">
        <MobileHeader
          onReset={() => setResetOpen(true)}
          soundEnabled={sound.enabled}
          onToggleSound={sound.toggle}
        />
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-10">
          {view === 'dashboard' && (
            <DashboardPage state={state} onNavigate={setView} onReset={() => setResetOpen(true)} />
          )}
          {view === 'assignments' && (
            <AssignmentsPage
              tasks={state.tasks}
              subjects={subjects}
              onAdd={handleAddTask}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          )}
          {view === 'attendance' && (
            <AttendancePage
              records={state.attendance}
              subjects={subjects}
              target={state.targetPercent}
              onSave={handleSaveAttendance}
              onDelete={handleDeleteAttendance}
              onTargetChange={app.setTargetPercent}
            />
          )}
          {view === 'planner' && (
            <PlannerPage sessions={state.sessions} subjects={subjects} onAdd={app.addSession} onDelete={app.deleteSession} />
          )}
        </main>
      </div>
      <MobileNav active={view} onChange={setView} />
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
      <Modal open={resetOpen} title="Reset demo data?" onClose={closeReset}>
        <p className="text-sm leading-relaxed text-slate-600">
          Your current assignments, attendance, and study sessions will be replaced with the sample data.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={closeReset}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              app.resetDemo();
              closeReset();
              setView('dashboard');
            }}
          >
            Reset data
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
