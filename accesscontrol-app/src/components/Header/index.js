import React, { useState, useEffect, useContext } from 'react';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavbarText,
    Modal,
    ModalHeader,
    ModalBody,
    Button,
    Input,
    Form,
    Row,
    Col,
    FormGroup,
    Badge,
    Tooltip
} from 'reactstrap';

import api from '../../services/api';
import { Context } from '../../contexts/AuthContext';

import Agendar from '../../components/Agendar';
import Autorizar from '../../components/Autorizar';
import Liberar from '../../components/Liberar';
import Cadastrar from '../../components/Cadastrar';
import AlterarSenha from '../../components/AlterarSenha';
import ListUsuarios from '../../components/Usuarios/ListUsuarios';
import CadastrarUsuario from '../../components/Usuarios/CadastrarUsuario';
import Consultar from '../../components/Consultar';

import avatar from '../../assets/avatar_profile.svg';
import './styles.css';

const Header = (props) => {
    const { user, role, setAuthenticated } = useContext(Context);
    const [isOpen, setIsOpen] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalAutorizar, setModalAutorizar] = useState(false);
    const [modalLiberar, setModalLiberar] = useState(false);
    const [modalConsultar, setModalConsultar] = useState(false);
    const [modalUsuarios, setModalUsuarios] = useState(false);
    const [modalCadastrar, setModalCadastrar] = useState(false);
    const [modalPerfilUsuario, setModalPerfilUsuario] = useState(false);
    const [modalAlterarSenha, setModalAlterarSenha] = useState(false);
    const [modalCadastrarUsuario, setModalCadastrarUsuario] = useState(false);
    const [search, setSearch] = useState("");
    const [countAgendar, setCountAgendar] = useState(0);
    const [countAutorizar, setCountAutorizar] = useState(0);
    const [countLiberar, setCountLiberar] = useState(0);
    const [disabledCadastrar, setDisabledCadastrar] = useState(false);
    const [disabledAgendar, setDisabledAgendar] = useState(false);
    const [disabledAutorizar, setDisabledAutorizar] = useState(false);
    const [disabledLiberar, setDisabledLiberar] = useState(false);
    const [disabledConsultar, setDisabledConsultar] = useState(false);

    const {
        className
    } = props;

    const toggle = () => setIsOpen(!isOpen);
    const toggleModal = () => {
        setModal(!modal);
        setSearch("");
    }
    const toggleModalAutorizar = () => {
        setModalAutorizar(!modalAutorizar);
        setSearch("");
    }
    const toggleModalLiberar = () => {
        setModalLiberar(!modalLiberar);
        setSearch("");
    }
    const toggleModalConsultar = () => {
        setModalConsultar(!modalConsultar);
        setSearch("");
    }
    const toggleModalUsuarios = () => {
        setModalUsuarios(!modalUsuarios);
        setSearch("");
    }
    const toggleModalCadastrar = () => setModalCadastrar(!modalCadastrar);
    const toggleModalPerfilUsuario = () => setModalPerfilUsuario(!modalPerfilUsuario);
    const toggleModalAlterarSenha = () => setModalAlterarSenha(!modalAlterarSenha);
    const toggleModalCadastrarUsuario = () => setModalCadastrarUsuario(!modalCadastrarUsuario);
    
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggleToolTip = () => setTooltipOpen(!tooltipOpen);

    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);

    useEffect(() => {
        if (role === "Administrador" || role === "Agendador" || role === "Autorizador") {
            (async () => {
                const response = await api.get("/notafiscal/agendar", {
                    headers: {
                        "Authorization": `Bearer ${userToken}`
                    }
                });

                setCountAgendar(response.data.length);
            })();
        } else {
            setDisabledCadastrar(true);
            setDisabledAgendar(true);
        }
    }, [role, userToken]);

    useEffect(() => {
        if (role === "Administrador" || role === "Autorizador") {
            (async () => {
                const response = await api.get("/notafiscal/autorizar", {
                    headers: {
                        "Authorization": `Bearer ${userToken}`
                    }
                });

                setCountAutorizar(response.data.length);
            })();
        } else {
            setDisabledAutorizar(true);
        }
    }, [role, userToken]);

    useEffect(() => {
        if (role === "Administrador" || role === "Liberador") {
            (async () => {
                const response = await api.get("/notafiscal/liberar", {
                    headers: {
                        "Authorization": `Bearer ${userToken}`
                    }
                });

                setCountLiberar(response.data.length);
            })();
        } else {
            setDisabledLiberar(true);
        }
    }, [role, userToken]);

    useEffect(() => {
        if (role === "Administrador" || role === "Agendador" || role === "Autorizador") {
            (async () => {
                const response = await api.get("/notafiscal", {
                    headers: {
                        "Authorization": `Bearer ${userToken}`
                    }
                });
                
                if (response.data) {
                    setDisabledConsultar(false);
                }
            })();
        } else {
            setDisabledConsultar(true);
        }
    }, [role, userToken]);

    const handleChange = (e) => {
        const value = e.target.value;
        setSearch(value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    function removeToken() {
        localStorage.clear();
        setAuthenticated(false);
    }

    return (
        <>
            <div className="main-menu">
                <Navbar className="main-nav" color="light" light expand="md">
                    <NavbarBrand href="/main">SisLOG</NavbarBrand>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <Button
                                    outline
                                    color="secondary"
                                    onClick={toggleModalCadastrar}
                                    disabled={disabledCadastrar}
                                >
                                    Cadastrar
                                </Button>
                            </NavItem>
                            <NavItem>
                                <Button
                                    outline
                                    color="secondary"
                                    onClick={toggleModal}
                                    disabled={disabledAgendar}
                                >
                                    Agendar
                            <Badge color="warning" style={{ marginLeft: 2 }}>{countAgendar ? countAgendar : ""}</Badge>
                                </Button>
                            </NavItem>
                            <NavItem>
                                <Button
                                    outline
                                    color="secondary"
                                    onClick={toggleModalAutorizar}
                                    disabled={disabledAutorizar}
                                >
                                    Autorizar
                            <Badge color="warning" style={{ marginLeft: 2 }}>{countAutorizar ? countAutorizar : ""}</Badge>
                                </Button>
                            </NavItem>
                            <NavItem>
                                <Button
                                    outline
                                    color="secondary"
                                    onClick={toggleModalLiberar}
                                    disabled={disabledLiberar}
                                >
                                    Liberar
                            <Badge color="warning" style={{ marginLeft: 2 }}>{countLiberar ? countLiberar : ""}</Badge>
                                </Button>
                            </NavItem>
                            <NavItem>
                                <Button
                                    outline
                                    color="secondary"
                                    onClick={toggleModalConsultar}
                                    disabled={disabledConsultar}
                                >
                                    Consultar
                                </Button>
                            </NavItem>
                            <NavItem>
                                <Button
                                    outline
                                    color="secondary"
                                    onClick={toggleModalUsuarios}
                                    disabled={role==="Administrador" ? false : true}
                                >
                                    Usuários
                                </Button>
                            </NavItem>
                        </Nav>
                        <NavbarText>
                            <img id="TooltipExample" onClick={toggleModalPerfilUsuario} style={{width: '2.3rem', height: '2.3rem'}} src={avatar} alt="avatar" />
                            <Tooltip placement="right" isOpen={tooltipOpen} target="TooltipExample" toggle={toggleToolTip}>
                                {user}
                            </Tooltip>
                        </NavbarText>
                    </Collapse>
                </Navbar>
            </div>
            <div>
                <Modal
                    isOpen={modalUsuarios}
                    toggle={toggleModalUsuarios}
                    className={className}
                    size="lg"
                    centered
                    backdrop="static"
                    scrollable={true}
                    keyboard={false}
                >
                    <ModalHeader toggle={toggleModalUsuarios}>
                        <Form
                            style={{ marginBottom: -20, marginTop: 0 }}
                            onSubmit={handleSubmit}
                        >
                            <Row form>
                                <Col md={8}>
                                    <FormGroup>
                                        <Input
                                            type="text"
                                            name="pesquisar"
                                            id="pesquisar"
                                            placeholder="conta"
                                            value={search.value}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Button onClick={toggleModalCadastrarUsuario} color="info" outline style={{width: '5rem'}}>Novo</Button>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </ModalHeader>
                    <ModalBody>
                        <ListUsuarios search={search} />
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={modalCadastrarUsuario}
                    toggle={toggleModalCadastrarUsuario}
                    className={className}
                    size="md"
                    centered
                    backdrop="static"
                    keyboard={false}
                >
                    <ModalHeader toggle={toggleModalCadastrarUsuario}>
                        Usuário
                    </ModalHeader>
                    <ModalBody>
                        <CadastrarUsuario name="Cadastrar" />
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={modalPerfilUsuario}
                    toggle={toggleModalPerfilUsuario}
                    className={className}
                    size="sm"
                    centered
                    backdrop="static"
                    keyboard={false}
                >
                    <ModalHeader toggle={toggleModalPerfilUsuario}>Olá {user}, o que deseja fazer?</ModalHeader>
                    <ModalBody>
                        <Button 
                            outline 
                            color="primary"
                            block
                            onClick={toggleModalAlterarSenha}
                        >
                            Alterar senha
                        </Button>
                        <Button 
                            outline 
                            color="danger"
                            block
                            onClick={removeToken}
                        >
                            Sair do sistema
                        </Button>
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={modalAlterarSenha}
                    toggle={toggleModalAlterarSenha}
                    className={className}
                    size="sm"
                    centered
                    backdrop="static"
                    keyboard={false}
                >
                    <ModalHeader toggle={toggleModalAlterarSenha}>Senha</ModalHeader>
                    <ModalBody>
                        <AlterarSenha />
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={modalCadastrar}
                    toggle={toggleModalCadastrar}
                    className={className}
                    size="md"
                    centered
                    backdrop="static"
                    keyboard={false}
                >
                    <ModalHeader style={{ backgroundColor: '#f58426'}} toggle={toggleModalCadastrar}>Nota Fiscal</ModalHeader>
                    <ModalBody>
                        <Cadastrar />
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={modal}
                    toggle={toggleModal}
                    className={className}
                    size="xl"
                    centered
                    backdrop="static"
                    scrollable={true}
                    keyboard={false}
                >
                    <ModalHeader style={{ backgroundColor: '#f58426'}} toggle={toggleModal}>
                        <Form
                            style={{ marginBottom: -20, marginTop: 0 }}
                            onSubmit={handleSubmit}
                        >
                            <Row form>
                                <Col md={12}>
                                    <FormGroup>
                                        <Input
                                            type="text"
                                            name="pesquisar"
                                            id="pesquisar"
                                            placeholder="nota fiscal"
                                            value={search.value}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </ModalHeader>
                    <ModalBody>
                        <Agendar search={search} />
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={modalAutorizar}
                    toggle={toggleModalAutorizar}
                    className={className}
                    size="xl"
                    centered
                    backdrop="static"
                    scrollable={true}
                    keyboard={false}
                >
                    <ModalHeader style={{ backgroundColor: '#f58426'}} toggle={toggleModalAutorizar}>
                        <Form
                            style={{ marginBottom: -20, marginTop: 0 }}
                            onSubmit={handleSubmit}
                        >
                            <Row form>
                                <Col md={12}>
                                    <FormGroup>
                                        <Input
                                            type="text"
                                            name="pesquisar"
                                            id="pesquisar"
                                            placeholder="nota fiscal"
                                            value={search.value}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </ModalHeader>
                    <ModalBody>
                        <Autorizar search={search} />
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={modalLiberar}
                    toggle={toggleModalLiberar}
                    className={className}
                    size="xl"
                    centered
                    backdrop="static"
                    scrollable={true}
                    keyboard={false}
                >
                    <ModalHeader style={{ backgroundColor: '#f58426'}} toggle={toggleModalLiberar}>
                        <Form
                            style={{ marginBottom: -20, marginTop: 0 }}
                            onSubmit={handleSubmit}
                        >
                            <Row form>
                                <Col md={12}>
                                    <FormGroup>
                                        <Input
                                            type="text"
                                            name="pesquisar"
                                            id="pesquisar"
                                            placeholder="nota fiscal"
                                            value={search.value}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </ModalHeader>
                    <ModalBody>
                        <Liberar search={search} />
                    </ModalBody>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={modalConsultar}
                    toggle={toggleModalConsultar}
                    className={className}
                    size="xl"
                    centered
                    backdrop="static"
                    scrollable={true}
                    keyboard={false}
                >
                    <ModalHeader style={{ backgroundColor: '#f58426'}} toggle={toggleModalConsultar}>
                        <Form
                            style={{ marginBottom: -20, marginTop: 0 }}
                            onSubmit={handleSubmit}
                        >
                            <Row form>
                                <Col md={12}>
                                    <FormGroup>
                                        <Input
                                            type="text"
                                            name="pesquisar"
                                            id="pesquisar"
                                            placeholder="nota fiscal"
                                            value={search.value}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </ModalHeader>
                    <ModalBody>
                        <Consultar search={search} />
                    </ModalBody>
                </Modal>
            </div>
        </>
    );
}

export default Header;