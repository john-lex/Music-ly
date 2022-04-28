import { toast } from 'react-toastify';

export default function alertErrors (type) {
    switch (type) {
        case 'auth/wrong-password':
            toast.warning('la contraseña es incorrecta');
        break;
        case 'auth/email-already-in-use':
            toast.warning('el correo ya esta en uso');
        break;
        case 'auth/too-many-requests':
            toast.warning('la contraseña es incorrecta');
        break;
        default:
            toast.warning('error en el servidor, intente mas tarde');
        break;
    }
} 