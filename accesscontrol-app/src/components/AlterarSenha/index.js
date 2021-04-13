import React, { useContext, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Row, Alert } from 'reactstrap';

import api from '../../services/api';
import { Context } from '../../contexts/AuthContext';

const AlterarSenha = () => {
    const { userId, setAuthenticated } = useContext(Context);
    const [msgError, setMsgError] = useState(false);
    const [data, setData] = useState({
        senha: "",
        novasenha: "",
        confirmarnovasenha: ""
    });

    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
        setMsgError(false);
    }
    
    const removeToken = () => {
        localStorage.clear();
        setAuthenticated(false);
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (data.novasenha !== data.confirmarnovasenha) {
            setMsgError(true);
            return;
        }

        const usuario = await api.get(`/usuario/${userId}`, {
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        });

        if (usuario) {
            await api.put(`/usuario/changepassword/${userId}`, {
                ...usuario.data,
                senha: data.senha,
                novaSenha: data.novasenha
            }, {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            }).then(res => {
                setData({
                    senha: "",
                    novasenha: "",
                    confirmarnovasenha: ""
                });

                removeToken();
            }).catch(res => {
                setMsgError(true);
            });
        }
    }

    return (
        <>
            {msgError ? <Alert color="danger">Senhas não conferem</Alert> : ""}
            <Form onSubmit={handleFormSubmit}>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Input
                                type="password"
                                name="senha"
                                placeholder="senha atual"
                                value={data.senha}
                                onChange={handleInputChange}
                                minLength={6}
                                required
                            >
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Input
                                type="password"
                                name="novasenha"
                                placeholder="nova senha"
                                value={data.novasenha}
                                onChange={handleInputChange}
                                minLength={6}
                                required
                            >
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Input
                                type="password"
                                name="confirmarnovasenha"
                                placeholder="confirmar nova senha"
                                value={data.confirmarnovasenha}
                                onChange={handleInputChange}
                                minLength={6}
                                required
                            >
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Button color="success" outline block>Salvar</Button>
            </Form>
        </>
    )
}

export default AlterarSenha;