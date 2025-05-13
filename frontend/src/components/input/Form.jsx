export const Form = ({onChange, value, handleSubmit}) => {
    return(
        <form onSubmit={handleSubmit}> 
            <input onChange={onChange}  type="text" placeholder="Type the /hi1 and press Enter"  value={value}/>
        </form>
    )
};
