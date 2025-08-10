import { FormGroup, AbstractControl, ValidationErrors } from "@angular/forms";

export const isRequired = (field: 'email' | 'password', form: FormGroup) => {
    const control = form.get(field);
    return control && control.touched && control.hasError('required');
};

export const hasemailerror = (form: FormGroup) => {
    const control = form.get('email');
    return control && control?.touched && control.hasError('email');
};

// Validador personalizado para prevenir inyección
export const noInjectionValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    const value = control.value.toString();
    
    // Patrones peligrosos
    const dangerousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /vbscript:/gi,
        /on\w+\s*=/gi,
        /(\bOR\b|\bAND\b|\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bUPDATE\b|\bDROP\b)/gi,
        /eval\s*\(/gi,
        /expression\s*\(/gi
    ];
    
    const hasInjection = dangerousPatterns.some(pattern => pattern.test(value));
    
    return hasInjection ? { injection: true } : null;
};

// Validador de contraseña segura
export const customPasswordValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    const password = control.value.toString();
    const errors: any = {};
    
    // Longitud mínima
    if (password.length < 8) {
        errors.minLength = true;
    }
    
    // Máximo permitido
    if (password.length > 128) {
        errors.maxLength = true;
    }
    
    // Al menos una mayúscula
    if (!/[A-Z]/.test(password)) {
        errors.uppercase = true;
    }
    
    // Al menos una minúscula
    if (!/[a-z]/.test(password)) {
        errors.lowercase = true;
    }
    
    // Al menos un número
    if (!/\d/.test(password)) {
        errors.number = true;
    }
    
    // Al menos un carácter especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.special = true;
    }
    
    // Verificar patrones de inyección
    const injection = noInjectionValidator(control);
    if (injection) {
        errors.injection = true;
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
};