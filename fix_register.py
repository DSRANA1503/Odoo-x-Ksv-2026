import re

with open("transitops/frontend/src/views/RegisterView.tsx", "r") as f:
    content = f.read()

content = content.replace('useState("Dispatcher")', 'useState("Fleet Manager")')
content = re.sub(
    r'<option value="Dispatcher">Dispatcher</option>.*?</select>',
    '''<option value="Fleet Manager">Fleet Manager</option>
                  <option value="Driver">Driver</option>
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                  <option value="Admin">Admin</option>
                </select>''',
    content,
    flags=re.DOTALL
)

with open("transitops/frontend/src/views/RegisterView.tsx", "w") as f:
    f.write(content)
