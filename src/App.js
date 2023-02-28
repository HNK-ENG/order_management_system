import UserRegister from './components/user/Register';
import UserLogin from './components/user/Login';
import UserHome from './components/user/Home';
import AdminLogin from './components/admin/Login';
import AdminHome from './components/admin/Home';
import Layout from './components/common/Layout';
import Missing from './components/common/Missing';
import Unauthorized from './components/common/Unauthorized';
import RequireAuth from './components/common/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import {ROLES} from './context/Globals';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
        {/* public routes */}
        <Route path="login" element={<UserLogin />} />
        <Route path="admin/authenticate" element={<AdminLogin />} />
        <Route path="register" element={<UserRegister />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* protected routes */}
        {/* user routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES[0]]} />}>
          <Route path="/" element={<UserHome />} />
        </Route>


        {/* admin routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES[1]]} />}>
          <Route path="admin" element={<AdminHome />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;