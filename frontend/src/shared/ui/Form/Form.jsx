export const UIForm = ({ handleSubmit, children, className="" , ...rest}) => {
    return(
        <form onSubmit={handleSubmit} className={className} {...rest}> 
        {children}
        </form>
    )
};
