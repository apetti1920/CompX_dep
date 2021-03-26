import ReactDOM from 'react-dom'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function Portal(props: any): React.ReactPortal {
    return ReactDOM.createPortal(props.children, document.body);
}

export default Portal;
