
import PropTypes from 'prop-types';
import './progressbar.css'

const Circle = ({ className, children }) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

// Adicione a validação de tipo para a propriedade 'className'
Circle.propTypes = {
    className: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default Circle;
