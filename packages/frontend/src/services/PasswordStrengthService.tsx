//Created based on leewinder work: https://gist.github.com/leewinder/a1f6bc5100fc2573b47bb2e0b7937f34

export const enum PasswordCheckStrength {
    Short = 1,
    Common = 2,
    Low = 3,
    Medium = 4,
    High = 5,
};

export class PasswordStrengthService {
    public static get MinimumLength(): number {
        return 8;
    }

    private commonPasswordPatterns = /passw.*|12345.*|09876.*|qwert.*|asdfg.*|zxcvb.*|footb.*|baseb.*|drago.*/;

    public isPasswordCommon(password: string): boolean {
        return this.commonPasswordPatterns.test(password);
    }

    public checkPasswordStrength(password: string): PasswordCheckStrength {
        // Build up the strenth of our password
        let numberOfElements = 0;
        numberOfElements = /.*[a-z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Lowercase letters
        numberOfElements = /.*[A-Z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Uppercase letters
        numberOfElements = /.*[0-9].*/.test(password) ? ++numberOfElements : numberOfElements;      // Numbers
        //numberOfElements = /[^a-zA-Z0-9]/.test(password) ? ++numberOfElements : numberOfElements;   // Special characters (inc. space)

        // Assume we have a poor password already
        let currentPasswordStrength = PasswordCheckStrength.Short;

        // Check then strenth of this password using some simple rules
        if (password === null || password.length < PasswordStrengthService.MinimumLength) {
            currentPasswordStrength = PasswordCheckStrength.Short;
        } else if (this.isPasswordCommon(password) === true) {
            currentPasswordStrength = PasswordCheckStrength.Common;
        } else if (numberOfElements === 0 || numberOfElements === 1) {
            currentPasswordStrength = PasswordCheckStrength.Low;
        } else if (numberOfElements === 2) {
            currentPasswordStrength = PasswordCheckStrength.Medium;
        } else {
            currentPasswordStrength = PasswordCheckStrength.High;
        }

        // Return the strength of this password
        //console.log(currentPasswordStrength);
        return currentPasswordStrength;
    }
}