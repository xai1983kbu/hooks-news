import React from 'react'
import useAuth from '../Auth/useAuth'
import FirebaseContext from '../../firebase/contex'
import LinkItem from './LinkItem'

function LinkList (props) {
  const { firebase } = React.useContext(FirebaseContext)
  const [links, setLinks] = React.useState([])
  const isNewPage = props.location.pathname.includes('new')

  React.useEffect(() => {
    getLinks()
  }, [])

  function getLinks () {
    firebase.db
      .collection('links')
      .orderBy('created', 'desc')
      .onSnapshot(handleSnapshot)
  }

  function handleSnapshot (snapshot) {
    const links = snapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() }
    })
    setLinks(links)
    // console.log({ links });
  }

  function renderLinks () {
    if (isNewPage) {
      return links
    }
    // And the reason that we have to call the slice method before we call sort
    // is that sort is a method that mutates the original array.
    const topLinks = links
      .slice()
      .sort((l1, l2) => l2.votes.length - l1.votes.length)
    return topLinks
  }

  return (
    <div>
      {renderLinks().map((link, index) => (
        <LinkItem key={link.id} showCount link={link} index={index + 1} />
      ))}
    </div>
  )
}

export default LinkList
