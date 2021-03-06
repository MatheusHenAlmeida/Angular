import { RouterTestingModule } from '@angular/router/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SignUpService } from './signup.service';
import { VMessageModule } from './../../shared/components/vmessage/vmessage.module';
import { UserNotTakenValidatorService } from './user-not-taken.validator.service';
import { SignUpComponent } from './signup.component';

describe('O formulário SignUp', () => {
    let component: SignUpComponent
    let router: Router
    let signupService: SignUpService

    // TODO: Testar
    class MockUserNotTakenValidatorService {
        // Sempre que eu retorno null, o FormGroup entende que o campo esta válido
        // Se eu retornar qualquer objeto (independente de seus valores), o FormGropu entende que o campo esta inválido
        checkUserNameTaken() {
            return (control: AbstractControl) => {
                console.log(`Mock: ${control.value}`)
                return of(null);
            }
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SignUpComponent],
            imports: [
                HttpClientTestingModule,
                VMessageModule,
                ReactiveFormsModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                SignUpService,
                UserNotTakenValidatorService
            ]
        }).compileComponents()
    }))

    beforeEach(() => {
        // TODO: Testar
        // Necessário, pois este provider foi enviado direto para o @Component do objeto de teste
        TestBed.overrideProvider(UserNotTakenValidatorService, {
            useValue: new MockUserNotTakenValidatorService()
        })
        
        router = TestBed.inject(Router)
        signupService = TestBed.inject(SignUpService)

        const fixture = TestBed.createComponent(SignUpComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('Deve ser instanciado', () => {
        expect(component).toBeTruthy()
    })

    it('Deve cadastrar um usuário', () => {
        const navigateSpy = spyOn(router, 'navigate')
        spyOn(signupService, 'signup').and.returnValue(of(null))

        component.signupForm.get('email').setValue('henrique@mail.com')
        component.signupForm.get('fullName').setValue('Henrique Santos')
        component.signupForm.get('userName').setValue('henriquey')
        component.signupForm.get('password').setValue('12345678')

        component.signup()

        expect(navigateSpy).toHaveBeenCalledWith([''])
    })

    it('Deve realizar o log caso ocorra algum erro', () => {
        spyOn(signupService, 'signup').and
            .returnValue(throwError('Erro de Servidor'))

        component.signupForm.get('email').setValue('henrique@mail.com')
        component.signupForm.get('fullName').setValue('Henrique Santos')
        component.signupForm.get('userName').setValue('henriquex')
        component.signupForm.get('password').setValue('12345678')

        const spyLog = spyOn(console, 'log')

        component.signup()

        expect(spyLog).toHaveBeenCalledWith('Erro de Servidor')
    })
})