import '../styles/Loading.css';
import { LoaderCircle } from 'lucide-react';

export const Loading = () => {
    return (
        <div className='Loading'>
        <LoaderCircle className='Loading-icon'/>
        <p>Loading...</p>
      </div>
    )
}

export default Loading;
