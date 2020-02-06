export class Employee {
  constructor(
    public $key: string,
    public fullName: string,
    public email: string,
    public mobile: string,
    public city: string,
    public gender: string,
    public department: number,
    public hireDate: Date = new Date(),
    public isPermanent: boolean = false
  ) {}
}
