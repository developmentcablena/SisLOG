import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Col, Form, FormGroup, Input, Row } from 'reactstrap';

import api from '../../services/api';

import { Context } from '../../contexts/AuthContext';

const CadastrarUsuario = (props) => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    
    const { setUpdatedUsers } = useContext(Context);

    const [data, setData] = useState({
        nome: "",
        conta: "",
        email: "",
        funcao: "",
        senha: "",
        confirmarsenha: ""
    });
    const [errorMsg, setErrorMsg] = useState(false);
    const [errorSrv, setErrorSrv] = useState(false);

    useEffect(() => {
        (async () => {
            if (props.id > 0) {
                const response = await api.get(`/usuario/${props.id}`, {
                    headers: {
                        "Authorization": `Bearer ${userToken}`
                    }
                });
                
                if (response) {
                    const usuario = response.data;
                    setData({ 
                        ...usuario,
                        senha: "",
                        confirmarsenha: ""
                    });
                }
            }
        })();
    }, [userToken, props.id]);

    const handleInputChange = (e) => {
        const value = e.target.value;

        setData({
            ...data,
            [e.target.name]: value
        });
        
        setErrorMsg(false);
        setErrorSrv(false);
    }

    const handleFormSubmit = async(e) => {
        e.preventDefault();
        
        setUpdatedUsers(false);

        if (props.name === "Cadastrar") {
            if(data.senha !== data.confirmarsenha) {
                setErrorMsg(true);
                return;
            }

            await api.post("/usuario", data, {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            }).then(res => {
                setData({
                    nome: "",
                    conta: "",
                    email: "",
                    funcao: "",
                    senha: "",
                    confirmarsenha: ""
                });
    
                setUpdatedUsers(true);
    
                setErrorSrv(false);
            }).catch(res => {
                setErrorSrv(true);
            });            
        } else {
            if (data.senha || data.confirmarsenha) {
                if(data.senha !== data.confirmarsenha) {
                    setErrorMsg(true);
                    return;
                }
            }

            await api.put(`/usuario/${props.id}`, data, {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            }).then(res => {
                setData({
                    nome: "",
                    conta: "",
                    email: "",
                    funcao: "",
                    senha: "",
                    confirmarsenha: ""
                });
    
                setUpdatedUsers(true);
    
                setErrorSrv(false);
            }).catch(res => {
                setErrorSrv(true);
            });            
        }
    }

    return (
        <Form onSubmit={handleFormSubmit}>
            { errorMsg ? <Alert color="danger">Senhas não conferem</Alert> : "" }
            { errorSrv ? <Alert color="danger">Não foi possível cadastrar o usuário, tente mais tarde</Alert> : "" }
            <Row form>
                <Col md={8}>
                    <FormGroup>
                        <Input 
                            type="text"
                            name="nome"
                            placeholder="nome"
                            required
                            value={data.nome}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup>
                        <Input 
                            type="text"
                            name="conta"
                            placeholder="conta"
                            required
                            value={data.conta}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col md={8}>
                    <FormGroup>
                        <Input 
                            type="email"
                            name="email"
                            placeholder="email"
                            required
                            value={data.email}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup>
                        <Input 
                            type="select"
                            name="funcao"
                            placeholder="função"
                            required
                            value={data.funcao}
                            onChange={handleInputChange}
                        >
                            <option></option>
                            <option value="Administrador">Administrador</option>
                            <option value="Agendador">Agendador</option>
                            <option value="Autorizador">Autorizador</option>
                            <option value="Liberador">Liberador</option>
                        </Input>
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col md={6}>
                    <FormGroup>
                        {props.name === "Cadastrar" ? 
                            <Input 
                                type="password"
                                name="senha"
                                placeholder="senha"
                                required
                                minLength={6}
                                value={data.senha}
                                onChange={handleInputChange}
                            />
                        :
                            <Input 
                                type="password"
                                name="senha"
                                placeholder="senha"
                                minLength={6}
                                value={data.senha}
                                onChange={handleInputChange}
                            />
                        }
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        {props.name === "Cadastrar" ?
                            <Input 
                                type="password"
                                name="confirmarsenha"
                                placeholder="confirmar senha"
                                required
                                minLength={6}
                                value={data.confirmarsenha}
                                onChange={handleInputChange}
                            />
                        :
                            <Input 
                                type="password"
                                name="confirmarsenha"
                                placeholder="confirmar senha"
                                minLength={6}
                                value={data.confirmarsenha}
                                onChange={handleInputChange}
                            />
                        }
                    </FormGroup>
                </Col>
            </Row>
            <Button color="success" outline block>{props.name}</Button>
        </Form>
    )
}

export default CadastrarUsuario;