import { FormControl, FormGroup } from "@angular/forms";

export function emailValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidEmail: true };
    }
    return null;
}

export function comboboxNumberValidator(control: FormControl): { [key: string]: any } | null {
    if (control.value === 0) {
        return { invalidField: true };
    }
    return null;
}

export function ceNameValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[a-zA-Z0-9-_()\n@,/.$%&:' ]*$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidCeName: true };
    }
    return null;
}

export function comboboxValidator(control: FormControl): { [key: string]: any } | null | null {
    const PATTERN = /^[A-Za-z-]*$/;
    const PATTERN1 = /^[0-9 -]*$/;
    if (!PATTERN.test(control.value) && !PATTERN1.test(control.value)) {
        return { invalidField: true };
    }
    return null;
}

export function comboboxStringValidator(control: FormControl): { [key: string]: any } | null {
    if (control.value === 'NA') {
        return { invalidField: true };
    }
    return null;
}

export function numberValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[0-9.]*$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidNumber: true };
    }
    return null;
}

export function codeValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[a-zA-Z]*$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidCode: true };
    }
    return null;
}

export function pacsNameValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[a-zA-Z ]*$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidPacsName: true };
    }
    return null;
}

export function nameValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[a-zA-Z.\d-_() ]*$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidName: true };
    }
    return null;
}

export function titleValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^(?![0-9_\@-]*$)^([0-9a-zA-Z _\@-]*)$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidTitle: true };
    }
    return null;
}

export function titleValidator2(control: FormControl): { [key: string]: any } | null {
    const pattern = /^([0-9a-zA-Z _\@-]*)$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidTitle: true };
    }
    return null;
}

export function userIdValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[a-zA-Z0-9 ]{5,20}$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidUserId: true };
    }
    return null;
}

export function addrValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[a-zA-Z0-9-_()\n@,/.$%&:' ]*$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidAddr: true };
    }
    return null;
}

export function licenseNoValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[a-zA-Z0-9-_()\&:/ ]*$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidLicense: true };
    }
    return null;
}

export function dateValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^((0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-[12]\d{3})$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidDate: true };
    }
    return null;
}

export function linkValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[a-zA-Z0-9-_()&./' ]*$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidLink: true };
    }
    return null;
}

export function passwordValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidPassword: true };
    }
    return null;
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
        const password = group.controls[passwordKey];
        const passwordConfirmation = group.controls[passwordConfirmationKey];
        if ((passwordConfirmation.value !== '') && (password.value !== passwordConfirmation.value)) {
            return passwordConfirmation.setErrors({ mismatchedPasswords: true });
        }
    };
}

export function resourceNameValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[a-zA-Z0-9-_&/ ]{2,50}$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidResourceName: true };
    }
    return null;
}

export function descValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[a-zA-Z0-9-_()\n@,/.$%&:' ]*$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidDesc: true };
    }
    return null;
}

export function urlValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[a-zA-Z0-9-_()@.&/' ]*$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidUrl: true };
    }
    return null;
}

export function roleNameValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[a-zA-Z0-9- _& ]{2,50}$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidRoleName: true };
    }
    return null;

}

export function mobileNumberValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[6-9]{1}[0-9]{9}$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidMobileNumber: true };
    }
    return null;
}

export function panCardValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[A-Z]{5}\d{4}[A-Z]{1}?$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidPanNumber: true };
    }
    return null;
}

export function aadharCardValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^((\+)?(\d{2}[-]))?(\d{12}){1}?$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidAadharNumber: true };
    }
    return null;
}

export function bankAccNoValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[0-9][0-9]{8,17}$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidAccountNumber: true };
    }
    return null;
}

export function gstinNoValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^([0][1-9]|[1-2][0-9]|[3][0-5])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidGstinNumber: true };
    }
    return null;
}

export function httpUrlValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidUrl: true };
    }
    return null;
}

export function nullValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^/;
    if (control.value && !pattern.test(control.value)) {
        return { invalid: true };
    }
    return null;
}

export function numberComparator(firstNum: string, secondNum: string) {
    return (group: FormGroup) => {
        const num1 = group.controls[firstNum];
        const num2 = group.controls[secondNum];
        if (Number(num1.value) > Number(num2.value)) {
            return num1.setErrors({ isGreaterThan: true });
        } else {
            return null;
        }
    };
}

export function emailPasswordValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!*])[A-Za-z\d$@$!*]{0,20}$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidPassword: true };
    }
    return null;
}

export function pinNumberValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[1-9][0-9]{5}$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidPinNumber: true };
    }
    return null;
}

export function landlineNumberValidation(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[0-9]{4}[-][0-9]{6}$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidLandlineNumber: true };
    }
    return null;
}

export function matchingAlternativeFields(primaryOne: string, alternativeOne: string) {
    return (group: FormGroup) => {
        const primary = group.get(primaryOne);
        const alternative = group.get(alternativeOne);
        if (alternative !== null && primary !== null) {
            if ((alternative.value !== '') && (alternative.value === primary.value)) {
                return alternative.setErrors({ identicalValueError: true });
            }
        }
        return null;
    };
}

export function voterIdValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^([a-zA-Z]){3}([0-9]){7}?$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidVoterIdNumber: true };
    }
    return null;
}

export function drivinglicenceValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidDrivingLicenceNumber: true };
    }
    return null;
}

export function passportValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /[A-Z]{1}[1-9]{1}[0-9]{5}[1-9]{1}/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidPassportNumber: true };
    }
    return null;
}

export function dateFormatValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidDate: true };
    }
    return null;
}

export function excelFileFormatValidator(control: FormControl): { [key: string]: any } | null {
    const allowedExcelFileFormat = /(\.xlsx|\.xls|\.csv)$/;
    if (!allowedExcelFileFormat.exec(control.value)) {
        return { invalidExcelFileFormat: true };
    }
    return null;
}

export function tanValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidTanNumber: true };
    }
    return null;
}

export function updatedLandlineValidator(control: FormControl): { [key: string]: any } | null {
    const pattern = /^[0-9]{4}[-][0-9]{6,7}$/;
    if (control.value && !pattern.test(control.value)) {
        return { invalidLandlineNumber: true };
    }
    return null;
}