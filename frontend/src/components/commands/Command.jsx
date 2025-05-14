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
            <p>{command.map((cmd)=> {
                name: cmd.name
                text: cmd.text
                command: cmd.command
            })}</p>
            <Button/>
        </div>
    )
}