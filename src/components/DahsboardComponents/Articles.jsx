const quickLinks = [
    { id: 1, title: "Link 1", url: "https://www.linkedin.com/feed/" },
    { id: 2, title: "Link 1", url: "https://www.linkedin.com/feed/" },
    { id: 3, title: "Link 1", url: "https://www.linkedin.com/feed/" },
    { id: 4, title: "Link 1", url: "#" },
  ]

  const documents = [
    { id: 1, title: "Pdf 1", url: "https://www.linkedin.com/feed/" },
    { id: 2, title: "Pdf 1", url: "https://www.linkedin.com/feed/" },
    { id: 3, title: "Pdf 1", url: "https://www.linkedin.com/feed/" },
    { id: 4, title: "Pdf 1", url: "https://www.linkedin.com/feed/" },
    { id: 5, title: "Pdf 1", url: "https://www.linkedin.com/feed/" },
  ]


export default function Articles(){
    return (
        <div className="  bg-white border-1 mr-8 border-[#D2D2D2] rounded-3xl shadow-md overflow-hidden">
            <div className="pt-6 pl-8 pb-4 ">
                <h2 className="text-xl font-semibold">Articles</h2>
            </div>
            <div
                className="w-[94%] mb-4 mx-6 mr-6 "
                style={{
                    borderBottom: "2px solid #D2D2D2",
                }}
            ></div>
          <div className="p-4 m-4">
            <h3 className="font-medium mb-3">Quick Links</h3>
            <div className="flex flex-row gap-3 mb-6">
              {quickLinks.map((link) => (
                <a
                  key={link.id}                  
                  href={link.url}
                  target="_blank"
                  className="flex flex-col justify-center items-center p-3 border rounded-lg hover:bg-gray-50 w-30 h-28 "
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-gray-400 text-xs">www</span>
                  </div>
                  <span className="text-sm text-blue-500">{link.title}</span>
                </a>
              ))}
            </div>
            
            <div
                className="w-full mb-4"
                style={{
                    borderBottom: "2px solid #D2D2D2",
                }}
            ></div>

            <h3 className="font-medium mb-3 mt-8">Documents</h3>
            <div className="flex flex-row gap-3">
              {documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  className="flex flex-col justify-center items-center p-3 border rounded-lg hover:bg-gray-50  w-30 h-28"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-red-500 text-xs">PDF</span>
                  </div>
                  <span className="text-sm text-blue-500">{doc.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
    )
}