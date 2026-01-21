// Validation utilities

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

// Email validation
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (Indian format)
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/[\s\-\+]/g, '');
    return phoneRegex.test(cleanPhone) || /^\+91\d{10}$/.test(cleanPhone);
}

// UUID validation
export function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

// Min length validation
export function minLength(value: string, min: number): boolean {
    return value.length >= min;
}

// Max length validation
export function maxLength(value: string, max: number): boolean {
    return value.length <= max;
}

// Required validation
export function isRequired(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
}

// Signup validation
export function validateSignup(data: {
    email?: string;
    password?: string;
    name?: string;
    phone?: string;
    college?: string;
}): ValidationResult {
    const errors: ValidationError[] = [];

    if (!isRequired(data.email)) {
        errors.push({ field: 'email', message: 'Email is required' });
    } else if (!isValidEmail(data.email!)) {
        errors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (!isRequired(data.password)) {
        errors.push({ field: 'password', message: 'Password is required' });
    } else if (!minLength(data.password!, 8)) {
        errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
    }

    if (!isRequired(data.name)) {
        errors.push({ field: 'name', message: 'Name is required' });
    } else if (!minLength(data.name!, 2)) {
        errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
    } else if (!maxLength(data.name!, 100)) {
        errors.push({ field: 'name', message: 'Name must not exceed 100 characters' });
    }

    if (!isRequired(data.phone)) {
        errors.push({ field: 'phone', message: 'Phone is required' });
    } else if (!isValidPhone(data.phone!)) {
        errors.push({ field: 'phone', message: 'Invalid phone number format' });
    }

    if (!isRequired(data.college)) {
        errors.push({ field: 'college', message: 'College is required' });
    }

    return { valid: errors.length === 0, errors };
}

// Registration validation
export function validateRegistration(data: {
    sport_id?: string;
    is_team?: boolean;
    team_name?: string;
    team_members?: Array<{ name?: string; email?: string; phone?: string }>;
}, teamSizeMin: number, teamSizeMax: number): ValidationResult {
    const errors: ValidationError[] = [];

    if (!isRequired(data.sport_id)) {
        errors.push({ field: 'sport_id', message: 'Sport ID is required' });
    } else if (!isValidUUID(data.sport_id!)) {
        errors.push({ field: 'sport_id', message: 'Invalid sport ID format' });
    }

    if (data.is_team) {
        if (!isRequired(data.team_name)) {
            errors.push({ field: 'team_name', message: 'Team name is required for team events' });
        }

        if (!data.team_members || data.team_members.length < teamSizeMin) {
            errors.push({
                field: 'team_members',
                message: `Team must have at least ${teamSizeMin} members`
            });
        } else if (data.team_members.length > teamSizeMax) {
            errors.push({
                field: 'team_members',
                message: `Team must not exceed ${teamSizeMax} members`
            });
        } else {
            data.team_members.forEach((member, index) => {
                if (!isRequired(member.name)) {
                    errors.push({
                        field: `team_members[${index}].name`,
                        message: 'Member name is required'
                    });
                }
                if (member.email && !isValidEmail(member.email)) {
                    errors.push({
                        field: `team_members[${index}].email`,
                        message: 'Invalid email format'
                    });
                }
                if (member.phone && !isValidPhone(member.phone)) {
                    errors.push({
                        field: `team_members[${index}].phone`,
                        message: 'Invalid phone format'
                    });
                }
            });
        }
    }

    return { valid: errors.length === 0, errors };
}

// Payment verification validation
export function validatePaymentVerification(data: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
}): ValidationResult {
    const errors: ValidationError[] = [];

    if (!isRequired(data.razorpay_order_id)) {
        errors.push({ field: 'razorpay_order_id', message: 'Order ID is required' });
    }

    if (!isRequired(data.razorpay_payment_id)) {
        errors.push({ field: 'razorpay_payment_id', message: 'Payment ID is required' });
    }

    if (!isRequired(data.razorpay_signature)) {
        errors.push({ field: 'razorpay_signature', message: 'Signature is required' });
    }

    return { valid: errors.length === 0, errors };
}
