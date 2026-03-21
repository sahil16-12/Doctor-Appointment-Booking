import Avatar from "../../ui/Avatar";
import Badge from "../../ui/Badge";

const DoctorSidebar = ({ activePage, setActivePage, doctorData, onLogout }) => {
  const navItems = [
    { id: "overview", icon: "⬡", label: "Overview", section: "practice" },
    {
      id: "appointments",
      icon: "📅",
      label: "Appointments",
      section: "patients",
    },
    {
      id: "patients",
      icon: "👥",
      label: "My Patients",
      section: "patients",
    },
    {
      id: "prescriptions",
      icon: "💊",
      label: "Prescriptions",
      section: "patients",
    },
    { id: "schedule", icon: "🗓️", label: "Schedule", section: "practice" },
    {
      id: "earnings",
      icon: "💰",
      label: "Earnings",
      section: "practice",
    },
  ];

  const sections = {
    practice: navItems.filter((n) => n.section === "practice"),
    patients: navItems.filter((n) => n.section === "patients"),
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 fixed top-0 left-0 overflow-y-auto shadow-lg">
      <div className="p-6 space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/sehat-logo.png"
            alt="Sehat"
            className="w-9 h-9 object-contain"
          />
          <span
            className="text-xl font-bold text-[#1e293b]"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Sehat
          </span>
        </div>

        {/* Profile Block */}
        {doctorData ? (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Avatar
                initials={doctorData.initials}
                color="bg-blue-600"
                size="lg"
                online={true}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1e293b]">
                  {doctorData.name}
                </p>
                <p className="text-xs text-gray-600 font-mono">
                  #{doctorData.id}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge
                variant="default"
                className="bg-white text-gray-700 border-gray-200"
              >
                {doctorData.specialization}
              </Badge>
              {doctorData.experience && (
                <Badge
                  variant="default"
                  className="bg-white text-gray-700 border-gray-200"
                >
                  {doctorData.experience} yrs
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="h-6 bg-gray-300 rounded-full w-20"></div>
              <div className="h-6 bg-gray-300 rounded-full w-20"></div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="space-y-1">
          <NavSection
            title="Practice"
            items={sections.practice}
            activePage={activePage}
            setActivePage={setActivePage}
          />
          <NavSection
            title="Patients"
            items={sections.patients}
            activePage={activePage}
            setActivePage={setActivePage}
          />
        </div>

        {/* Logout Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all text-center border border-red-200"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

const NavSection = ({ title, items, activePage, setActivePage }) => {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activePage === item.id
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="text-base w-6 text-center">{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge
                variant={item.badgeClass || "pending"}
                className={`text-xs px-2 py-0.5 ${
                  activePage === item.id
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-blue-100 text-blue-700 border-blue-200"
                }`}
              >
                {item.badge}
              </Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DoctorSidebar;
