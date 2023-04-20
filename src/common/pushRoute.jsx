// import { useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export function pushRoute(Component) {
  return (props) => (
    <Component
      {...props}
      location={useLocation()}
      params={useParams()}
      navigate={useNavigate()}
    />
  );
}
