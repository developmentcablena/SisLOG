import React, { useState, useEffect, useContext } from 'react';
import { Table, Modal, ModalHeader, ModalBody } from 'reactstrap';

import api from '../../services/api';
import { Context } from '../../contexts/AuthContext';

import CadastrarUsuario from './CadastrarUsuario';

const ListUsuarios = (props) => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    const { updatedUsers, setUpdatedUsers } = useContext(Context);
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [modalCadastrarUsuario, setModalCadastrarUsuario] = useState(false);
    const [usuarioId, setUsuarioId] = useState(0);

    let { search } = props;

    useEffect(() => {
        (async () => {
            const response = await api.get("/usuario", {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            });

            if (response) {
                const orderedUsuarios = response.data.sort((a, b) => {
                    let x = a.nome.toUpperCase(),
                        y = b.nome.toUpperCase();

                    return x === y ? 0 : x > y ? 1 : -1;
                });

                setUsuarios(orderedUsuarios);
            }
        })();
    }, [userToken, updatedUsers]);

    useEffect(() => {
        const filterUsuarios = usuarios.filter((usuario) => {
            return usuario.conta.toLowerCase() === search.toLowerCase();
        });

        setFilteredUsuarios(filterUsuarios);

    },[search, usuarios]);

    const toggleModalCadastrarUsuario = (id) => {
        setModalCadastrarUsuario(!modalCadastrarUsuario);
        if (modalCadastrarUsuario === false) {
            setUsuarioId(id);
        } else {
            setUsuarioId(0);
        }
    }
    
    const handleStatusChange = async(id) => {
        setUpdatedUsers(false);

        const response = await api.get(`/usuario/${id}`, {
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        });

        if (response) {
            const usuario = response.data;

            await api.put(`/usuario/${id}`, {
                ...usuario,
                status: usuario.status === 0 ? 1 : 0
            }, {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            });
            
            setUpdatedUsers(true);
        }
    }

    const renderHeader = () => {
        let headerElement = ['Nome', 'Conta', 'Função', '', ''];

        return headerElement.map((key, index) => {
            return <th key={index}>{key}</th>
        })
    }

    const renderBody = () => {
        if (search === "") {
            return usuarios && usuarios.map(usuario => {
                return (
                    <tr key={usuario.id}>
                        <td>{usuario.nome}</td>
                        <td>{usuario.conta}</td>
                        <td>{usuario.funcao}</td>
                        <td>
                            <svg onClick={() => toggleModalCadastrarUsuario(usuario.id)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>
                        </td>
                        <td>
                            {usuario.status === 0 ?
                            <svg onClick={() => handleStatusChange(usuario.id)} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-square" fill="red" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                            :
                            <svg onClick={() => handleStatusChange(usuario.id)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check-square" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path fillRule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                            </svg>
                            }
                        </td>
                    </tr>
                )                     
            })
        }

        if (filteredUsuarios) {
            return filteredUsuarios.map(usuario => {
                return (
                    <tr key={usuario.id}>
                        <td>{usuario.nome}</td>
                        <td>{usuario.conta}</td>
                        <td>{usuario.funcao}</td>
                        <td>
                            <svg onClick={() => toggleModalCadastrarUsuario(usuario.id)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>
                        </td>
                        <td>
                            {usuario.status === 0 ?
                            <svg onClick={() => handleStatusChange(usuario.id)} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-square" fill="red" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                            :
                            <svg onClick={() => handleStatusChange(usuario.id)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check-square" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path fillRule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                            </svg>
                            }
                        </td>
                    </tr>
                )
            })
        }
    } 

    return (
        <>
        <Table borderless responsive hover>
            <thead>
                <tr>{renderHeader()}</tr>
            </thead>
            <tbody>
                {renderBody()}
            </tbody>
        </Table>
        <div>
            <Modal
                isOpen={modalCadastrarUsuario}
                toggle={toggleModalCadastrarUsuario}
                size="md"
                centered
                backdrop="static"
                keyboard={false}
            >
                <ModalHeader toggle={toggleModalCadastrarUsuario}>
                    Usuário
                </ModalHeader>
                <ModalBody>
                    <CadastrarUsuario name="Salvar" id={usuarioId} />
                </ModalBody>
            </Modal>
        </div>
    </>
    )
}

export default ListUsuarios;