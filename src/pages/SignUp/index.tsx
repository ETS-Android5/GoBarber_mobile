import React, { useRef, useCallback } from 'react';
import { Image, KeyboardAvoidingView, Platform, View, TextInput, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErros';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, BackToSignInButton, BackToSignInButtonText } from './styles';

interface SignUpFormData {
	name: string;
	email: string;
	password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const navigation = useNavigation();

    const emailInputRef = useRef<TextInput>();
		const passwordInputRef = useRef<TextInput>();
		
		const handleSignUp = useCallback(async (data: SignUpFormData) => {
			try {
				formRef.current?.setErrors({});
	
				const schema = Yup.object().shape({
					name: Yup.string()
						.required('Nome obrigatório'),
					email: Yup.string()
						.required('E-mail obrigatório')
						.email('Digite um e-mail válido'),
					password: Yup.string().required('Senha Obrigatória')
				});
	
				await schema.validate(data, {
					abortEarly: false
				});
				
				await api.post('/users', data);
				
				Alert.alert(
					'Cadastro realizado com sucesso!',
					'Voce já pode fazer login na aplicação'
				);

				navigation.goBack();
			} catch(err) {
				console.log(err);
				if (err instanceof Yup.ValidationError) {
					const validationErrors = getValidationErrors(err);
					formRef.current?.setErrors(validationErrors);
	
					return;
				}

				Alert.alert(
					'Erro no cadastro',
					'Ocorreu um erro ao fazer seu cadastro, tente novamente',
				);
			}
		},
		[navigation]);

    return(
        <>
            <KeyboardAvoidingView 
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled    
            >
                <ScrollView 
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{flex: 1}}    
                >
									<Container>
										<Image source={logoImg} />
                        
											<View>
													<Title>Crie sua conta</Title>
											</View>
											<Form ref={formRef} onSubmit={handleSignUp}>
													<Input autoCorrect={true}
															autoCapitalize='words'
															name='name'
															icon='user'
															placeholder='Nome'
															returnKeyType='next'
															onSubmitEditing={() => {
																	emailInputRef.current?.focus();
															}}
													/>
													<Input 
															ref={emailInputRef}
															keyboardType='email-address'
															autoCorrect={false}
															autoCapitalize='none'
															name='email'
															icon='mail'
															placeholder='E-mail'
															returnKeyType='next'
															onSubmitEditing={() => {
																	passwordInputRef.current?.focus();
															}}
													/>
													<Input
															ref={passwordInputRef}
															textContentType='newPassword'
															secureTextEntry
															name='password'
															icon='lock'
															placeholder='Senha'
															returnKeyType='send'
															onSubmitEditing={() => {
																	formRef.current?.submitForm();
															}}
													/>
											</Form>                        
											<Button onPress={() => formRef.current?.submitForm()}>Criar Conta</Button>
									</Container>
							</ScrollView>        
					</ KeyboardAvoidingView>
					<BackToSignInButton onPress={() => navigation.goBack()}>
							<Icon name='log-in' size={20} color='#FF9000' />
							<BackToSignInButtonText>
									Voltar para login
							</BackToSignInButtonText>
					</BackToSignInButton>
			</>
	);
};

export default SignUp;
