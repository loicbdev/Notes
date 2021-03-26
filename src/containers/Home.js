import React, {useState, useEffect} from "react"
import {API} from "aws-amplify"
import {Link} from "react-router-dom"
import {BsPencilSquare} from "react-icons/bs"
import ListGroup from "react-bootstrap/ListGroup"
import {LinkContainer} from "react-router-bootstrap"
import {useAppContext} from "../libs/contextLib"
import {onError} from "../libs/errorLib"
import "./Home.css"

export default function Home() {
  const [notes, setNotes] = useState([])
  const {isAuthenticated} = useAppContext()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return
      }

      try {
        const notes = await loadNotes()
        setNotes(notes)
      } catch (e) {
        onError(e)
      }

      setIsLoading(false)
    }

    onLoad()
  }, [isAuthenticated])

  function loadNotes() {
    return API.get("notes", "/notes")
  }

  function renderNotesList(notes) {
    return (
      <>
        <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">
              Créer une nouvelle note
            </span>
          </ListGroup.Item>
        </LinkContainer>
        {notes.map(({noteId, content, createdAt}) => (
          <LinkContainer key={noteId} to={`/notes/${noteId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {content.trim().split("\n")[0]}
              </span>
              <br />
              <span className="text-muted">
                Création: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    )
  }

  function renderLander() {
    return (
      <div className="banner">
        <div className="lander">
          <div className="welcomeMessage">
            <h3>Bienvenue!</h3>
            <p>
              Ici, vous pouvez conserver vos notes et leurs documents associés.
            </p>
          </div>
          <div className="pt-3">
            <Link to="/login" className="btn btn-info btn-lg mr-3">
              Login
            </Link>
            <Link to="/signup" className="btn btn-success btn-lg">
              Signup
            </Link>
          </div>
        </div>
      </div>
    )
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Mes Notes</h2>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    )
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  )
}
