# Defined Convention

## 1.Modules
### 1.แยก module ตาม domain เช่น auth, users, files
### 2.แต่ละ module ประกอบด้วย
    - Controller
    - Service
    - File Module
    - Dto (Model ทั่วไป เช่น ทำ model ขอ body)
    - Entity (Model ของ db)

## 2.Common
###
```
  1.Decorators ใช้เพื่อ เพิ่ม Metadata. เช่น @GetUser()
  2.Filters ใช้เพื่อจัดการ Excetions ทั้ง app 
  3.Guards ใช้เพื่อกันการเช้าถึง route. เช่น JWTGuards ที่ต้องมี token ก่อน
  4.Interceptors ใช้ ตรวจสอบ หรือ เพิ่มข้อมูล ก่อนหรือหลัง Request/Response
  5.Interfaces กำหนดโครงสร้างข้อมูล
  6.Utils  function ช่วยต่างๆ
```
