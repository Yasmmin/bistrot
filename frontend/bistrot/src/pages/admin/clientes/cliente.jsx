import Sidebar from "../../../components/sidebar/sidebar"

function Cliente() {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="d-flex flex-column flex-grow-1 ml-2">
                <div className="d-flex justify-content-between align-items-center mt-3 mx-4">
                    <form className="d-flex w-100 ">
                        {/*campo de pesquisa com icone dentro*/}
                        <div className="input-group">
                            <input
                                className="form-control flex-grow-1 mr-2 mb-3"
                                type="search"
                                placeholder="pesquisar"
                                style={{ height: '3rem' }}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Cliente