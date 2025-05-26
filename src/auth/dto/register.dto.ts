import { Exclude, Expose, Transform } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString, Matches, Min, MinDate } from "class-validator";

const isAdult = new Date();
isAdult.setFullYear(isAdult.getFullYear() - 18); // Set to 18 years ago
console.log("Minimum date for adulthood:", isAdult);

export class RegisterDTO {
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty({ message: "Email cannot be empty" })
    @Expose()
    email: string;

    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
    })
    @IsNotEmpty({ message: "Password cannot be empty" })
    // @Exclude()
    password: string;

    @IsString({ message: "Name must be a string" })
    @IsNotEmpty({ message: "Name cannot be empty" })
    @Expose()
    name: string;

    @Transform(({ value }) => new Date(value))
    @MinDate(new Date(isAdult), { message: "You must be at least 18 years old" })
    @IsDate({ message: "Date of birth must be a valid date" })
    @IsNotEmpty({ message: "Date of birth cannot be empty" })
    @Expose()
    dateOfBirth: Date;
}