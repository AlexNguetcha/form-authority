const FormAuthorityError = (name: string, message: string) => {
    return <div className={`form-authority-error form-authority-error__${name}`}>{message}</div>
}

export { FormAuthorityError }