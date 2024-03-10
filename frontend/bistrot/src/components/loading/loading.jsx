import loading from './../../assets/loading.svg';
import './loading.css';

function Loading() {
    return (
        <div className='loading'>
            <img src={loading} className='loader' alt='carregamento' />
        </div>
    );
}

export default Loading;
