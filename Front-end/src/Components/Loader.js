import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Animations/loading.json';
import '../App.css'

function Loader(props) {

    return (
        <>
            {
                props.isLoading
                    ?
                    <div className='loading-background'>
                        <div className='loading-wrapper'>
                            <Player
                                src={Loading}
                                className="loading-animation"
                                loop
                                autoplay
                                // background='white'
                            />
                        </div>
                    </div>
                    :
                    null
            }
        </>
    );
}

export default Loader;