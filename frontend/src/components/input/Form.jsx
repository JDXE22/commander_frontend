export const Form = ({onChange, value}) => {
    return(
        <form> 
            <input onChange={onChange}  type="text" placeholder="Type the /hi1 and press Enter"  value={value}/>
        </form>
    )
};
