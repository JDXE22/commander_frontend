export const CommandList = ({command}) => {
    const Button = () => {
        return(
            <>
            <button>Copy text</button>
            </>
        )
    }
    return (
        <div>
            <p>{command.text}</p>
            <Button/>
        </div>
    )
}