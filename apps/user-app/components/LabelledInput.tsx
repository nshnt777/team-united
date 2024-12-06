interface LabelledInputProps {
    label: string,
    type: string,
    placeholder: string,
    name: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>)=>void,
    defaultValue?: string
}

export default function LabelledInput({label, type, placeholder, name, onChange, defaultValue}: LabelledInputProps){
    return(
        <div className="flex flex-col mb-3">
            <label 
                htmlFor={label.toLowerCase()}
                className="font-bold "
            >
                {label}
            </label>

            <input 
                type={type} 
                placeholder={placeholder} 
                name={name} 
                onChange={onChange}
                className="text-black border rounded-sm px-2 py-1 bg-slate-50"
                defaultValue={defaultValue || ""}
            />
            {type === 'password' ? 
                <span
                    className="text-slate-400 text-xs"
                >
                    *minimum 8 characters
                </span>
            : null}
        </div>
    )
}