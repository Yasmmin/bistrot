// privateRoutes.jsx
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ element, requiredRoles }) => {
  const isAuthenticated = document.cookie.includes('token');
  const userRole = document.cookie.includes('role') || 'user';

  if (isAuthenticated && requiredRoles.includes(userRole)) {
    return element;
  } else if (isAuthenticated) {
    // Verifica se o usuário é administrador e redireciona para a página de Sidebar
    if (userRole === 'admin' && requiredRoles.includes('admin')) {
      return <Navigate to="/sidebar" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PrivateRoute;
