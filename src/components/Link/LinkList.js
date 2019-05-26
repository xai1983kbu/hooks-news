import React from 'react'
import useAuth from '../Auth/useAuth'
import FirebaseContext from '../../firebase/contex'
import LinkItem from './LinkItem'
import { LINKS_PER_PAGE } from '../../utils/index'

function LinkList (props) {
  const { firebase } = React.useContext(FirebaseContext)
  const [links, setLinks] = React.useState([])
  const [cursor, setCursor] = React.useState(null)
  const isNewPage = props.location.pathname.includes('new')
  const isTopPage = props.location.pathname.includes('top')
  // for  `/new/1`  page = 1
  const page = Number(props.match.params.page)

  React.useEffect(
    () => {
      const unsubscribe = getLinks()
      return () => unsubscribe()
    },
    [isTopPage, page]
  )

  function getLinks () {
    const hasCursor = Boolean(cursor)
    if (isTopPage) {
      return firebase.db
        .collection('links')
        .orderBy('voteCount', 'desc')
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot)
    } else if (page === 1) {
      return firebase.db
        .collection('links')
        .orderBy('created', 'desc')
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot)
    } else if (hasCursor) {
      return firebase.db
        .collection('links')
        .orderBy('created', 'desc')
        .startAfter(cursor.created)
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot)
    }
  }

  function handleSnapshot (snapshot) {
    const links = snapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() }
    })
    setLinks(links)
    // console.log({ links });
    const lastLink = links[links.length - 1]
    setCursor(lastLink)
  }

  function visitPreviousPage () {
    if (page > 1) {
      props.history.push(`/new/${page - 1}`)
    }
  }

  function visitNextPage () {
    if (page <= links.length / LINKS_PER_PAGE) {
      props.history.push(`/new/${page + 1}`)
    }
  }

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE + 1 : 0

  return (
    <div>
      {links.map((link, index) => (
        <LinkItem
          key={link.id}
          showCount
          link={link}
          index={index + pageIndex}
        />
      ))}
      {isNewPage && (
        <div className='pagination'>
          <div className='pointer mr2' onClick={visitPreviousPage}>
            Previous
          </div>
          <div className='pointer' onClick={visitNextPage}>
            Next
          </div>
        </div>
      )}
    </div>
  )
}

export default LinkList
