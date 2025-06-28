export interface EmpleadoUsuarioDTO {
    // Datos del empleado
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    fechaInicioContrato: string;
    idPuesto: number;

    // Datos para el login
    usuario: string;
    contrasena: string;
} 