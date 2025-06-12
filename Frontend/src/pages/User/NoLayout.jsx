import { Outlet } from "react-router-dom";

function NoLayout() {
  return (
    <main className="main_content p-4">
      <Outlet />
    </main>
  );
}

export default NoLayout;