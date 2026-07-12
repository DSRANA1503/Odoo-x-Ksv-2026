import re

with open("transitops/frontend/src/views/LoginView.tsx", "r") as f:
    content = f.read()

content = re.sub(
    r'<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">\s*Sign in to TransitOps.*?</p>',
    '''<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to TransitOps
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>''',
    content,
    flags=re.DOTALL
)

with open("transitops/frontend/src/views/LoginView.tsx", "w") as f:
    f.write(content)
